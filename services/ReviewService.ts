import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { Review, Appointment } from '@/types';
import NotificationService from './NotificationService';
import OfflineService from './OfflineService';

export interface ReviewPrompt {
  id: string;
  appointmentId: string;
  providerId: string;
  providerName: string;
  serviceDate: Date;
  promptDate: Date;
  status: 'pending' | 'completed' | 'dismissed';
  reminderCount: number;
}

export interface PhotoReview {
  beforePhoto?: string; // Base64 or URI
  afterPhoto?: string;
  description?: string;
}

export interface EnhancedReview extends Review {
  photos?: PhotoReview;
  helpfulVotes: number;
  reportCount: number;
  isVerified: boolean;
  responseFromProvider?: {
    message: string;
    date: Date;
    providerName: string;
  };
  qualityScore: number; // AI-generated quality score
  tags: string[]; // Auto-generated tags
}

export interface ReviewAnalytics {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
  recentTrend: 'improving' | 'declining' | 'stable';
  commonKeywords: { word: string; frequency: number }[];
  responseRate: number;
  averageResponseTime: number; // in hours
}

class ReviewService {
  private static instance: ReviewService;
  private reviewPrompts: ReviewPrompt[] = [];

  private constructor() {
    this.loadReviewPrompts();
    this.schedulePromptChecks();
  }

  static getInstance(): ReviewService {
    if (!ReviewService.instance) {
      ReviewService.instance = new ReviewService();
    }
    return ReviewService.instance;
  }

  // Automated review prompts
  async scheduleReviewPrompt(appointment: Appointment): Promise<void> {
    try {
      const promptDate = new Date(appointment.date);
      promptDate.setHours(promptDate.getHours() + 2); // 2 hours after appointment

      const prompt: ReviewPrompt = {
        id: `prompt_${appointment.id}_${Date.now()}`,
        appointmentId: appointment.id,
        providerId: appointment.providerId,
        providerName: appointment.providerName,
        serviceDate: new Date(appointment.date),
        promptDate,
        status: 'pending',
        reminderCount: 0,
      };

      this.reviewPrompts.push(prompt);
      await this.saveReviewPrompts();

      // Schedule notification
      await NotificationService.scheduleReviewRequest(
        prompt.id,
        prompt.providerName,
        promptDate
      );

      console.log('Review prompt scheduled for:', prompt.providerName, 'at', promptDate);
    } catch (error) {
      console.error('Error scheduling review prompt:', error);
    }
  }

  async getPendingPrompts(): Promise<ReviewPrompt[]> {
    const now = new Date();
    return this.reviewPrompts.filter(
      prompt => prompt.status === 'pending' && prompt.promptDate <= now
    );
  }

  async markPromptCompleted(promptId: string): Promise<void> {
    const prompt = this.reviewPrompts.find(p => p.id === promptId);
    if (prompt) {
      prompt.status = 'completed';
      await this.saveReviewPrompts();
    }
  }

  async dismissPrompt(promptId: string): Promise<void> {
    const prompt = this.reviewPrompts.find(p => p.id === promptId);
    if (prompt) {
      prompt.status = 'dismissed';
      await this.saveReviewPrompts();
    }
  }

  async sendReminder(promptId: string): Promise<void> {
    const prompt = this.reviewPrompts.find(p => p.id === promptId);
    if (prompt && prompt.reminderCount < 2) { // Max 2 reminders
      prompt.reminderCount++;
      
      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + 3); // 3 days later
      
      await NotificationService.scheduleReviewRequest(
        `${prompt.id}_reminder_${prompt.reminderCount}`,
        prompt.providerName,
        reminderDate
      );
      
      await this.saveReviewPrompts();
    }
  }

  // Photo handling
  async requestPhotoPermissions(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting photo permissions:', error);
      return false;
    }
  }

  async selectBeforeAfterPhotos(): Promise<PhotoReview | null> {
    try {
      const hasPermission = await this.requestPhotoPermissions();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Please grant photo library access to add photos to your review.');
        return null;
      }

      return new Promise((resolve) => {
        Alert.alert(
          'Add Photos',
          'Would you like to add before and after photos to your review?',
          [
            { text: 'Skip', onPress: () => resolve(null) },
            { text: 'Add Photos', onPress: () => this.handlePhotoSelection(resolve) },
          ]
        );
      });
    } catch (error) {
      console.error('Error selecting photos:', error);
      return null;
    }
  }

  private async handlePhotoSelection(resolve: (photos: PhotoReview | null) => void): Promise<void> {
    try {
      const photos: PhotoReview = {};

      // Select before photo
      Alert.alert(
        'Before Photo',
        'Select a photo taken before the service',
        [
          { text: 'Skip', onPress: () => this.selectAfterPhoto(photos, resolve) },
          { text: 'Select', onPress: () => this.selectPhoto('before', photos, resolve) },
        ]
      );
    } catch (error) {
      console.error('Error handling photo selection:', error);
      resolve(null);
    }
  }

  private async selectPhoto(
    type: 'before' | 'after',
    photos: PhotoReview,
    resolve: (photos: PhotoReview | null) => void
  ): Promise<void> {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (type === 'before') {
          photos.beforePhoto = asset.base64 || asset.uri;
          this.selectAfterPhoto(photos, resolve);
        } else {
          photos.afterPhoto = asset.base64 || asset.uri;
          resolve(photos);
        }
      } else {
        if (type === 'before') {
          this.selectAfterPhoto(photos, resolve);
        } else {
          resolve(photos);
        }
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      resolve(null);
    }
  }

  private selectAfterPhoto(photos: PhotoReview, resolve: (photos: PhotoReview | null) => void): void {
    Alert.alert(
      'After Photo',
      'Select a photo taken after the service',
      [
        { text: 'Skip', onPress: () => resolve(photos) },
        { text: 'Select', onPress: () => this.selectPhoto('after', photos, resolve) },
      ]
    );
  }

  // Enhanced review creation
  async createEnhancedReview(
    providerId: string,
    rating: number,
    comment: string,
    serviceType: string,
    photos?: PhotoReview
  ): Promise<EnhancedReview> {
    try {
      const review: EnhancedReview = {
        id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: 'current_user_id', // Replace with actual user ID
        providerId,
        rating,
        comment,
        date: new Date(),
        serviceType,
        photos,
        helpfulVotes: 0,
        reportCount: 0,
        isVerified: true, // Mark as verified since it's from a completed appointment
        qualityScore: await this.calculateQualityScore(comment, photos),
        tags: await this.generateTags(comment, serviceType),
      };

      // Store review locally
      await this.storeReview(review);

      // Queue for sync if offline
      await OfflineService.queueAction({
        type: 'create',
        entity: 'review',
        data: review,
      });

      console.log('Enhanced review created:', review.id);
      return review;
    } catch (error) {
      console.error('Error creating enhanced review:', error);
      throw error;
    }
  }

  // Quality assurance
  private async calculateQualityScore(comment: string, photos?: PhotoReview): Promise<number> {
    let score = 0;

    // Comment quality (0-60 points)
    if (comment.length > 50) score += 20;
    if (comment.length > 100) score += 20;
    if (this.hasSpecificDetails(comment)) score += 20;

    // Photo quality (0-30 points)
    if (photos?.beforePhoto) score += 15;
    if (photos?.afterPhoto) score += 15;

    // Helpfulness indicators (0-10 points)
    if (this.containsHelpfulKeywords(comment)) score += 10;

    return Math.min(score, 100);
  }

  private hasSpecificDetails(comment: string): boolean {
    const detailKeywords = [
      'service', 'staff', 'clean', 'professional', 'time', 'price',
      'recommend', 'experience', 'quality', 'atmosphere', 'booking'
    ];
    
    const lowerComment = comment.toLowerCase();
    return detailKeywords.some(keyword => lowerComment.includes(keyword));
  }

  private containsHelpfulKeywords(comment: string): boolean {
    const helpfulKeywords = [
      'would recommend', 'great experience', 'professional', 'clean',
      'on time', 'friendly', 'skilled', 'excellent', 'satisfied'
    ];
    
    const lowerComment = comment.toLowerCase();
    return helpfulKeywords.some(keyword => lowerComment.includes(keyword));
  }

  private async generateTags(comment: string, serviceType: string): Promise<string[]> {
    const tags: string[] = [serviceType];
    const lowerComment = comment.toLowerCase();

    // Service quality tags
    if (lowerComment.includes('excellent') || lowerComment.includes('amazing')) {
      tags.push('excellent-service');
    }
    if (lowerComment.includes('professional')) {
      tags.push('professional');
    }
    if (lowerComment.includes('clean')) {
      tags.push('clean-environment');
    }
    if (lowerComment.includes('friendly')) {
      tags.push('friendly-staff');
    }
    if (lowerComment.includes('quick') || lowerComment.includes('fast')) {
      tags.push('efficient');
    }
    if (lowerComment.includes('recommend')) {
      tags.push('recommended');
    }

    return tags;
  }

  // Review analytics
  async getReviewAnalytics(providerId: string): Promise<ReviewAnalytics> {
    try {
      const reviews = await this.getProviderReviews(providerId);
      
      if (reviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: {},
          recentTrend: 'stable',
          commonKeywords: [],
          responseRate: 0,
          averageResponseTime: 0,
        };
      }

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      const ratingDistribution: { [key: number]: number } = {};
      reviews.forEach(review => {
        ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
      });

      const recentTrend = this.calculateTrend(reviews);
      const commonKeywords = this.extractCommonKeywords(reviews);
      const responseRate = this.calculateResponseRate(reviews);
      const averageResponseTime = this.calculateAverageResponseTime(reviews);

      return {
        averageRating,
        totalReviews: reviews.length,
        ratingDistribution,
        recentTrend,
        commonKeywords,
        responseRate,
        averageResponseTime,
      };
    } catch (error) {
      console.error('Error getting review analytics:', error);
      throw error;
    }
  }

  private calculateTrend(reviews: EnhancedReview[]): 'improving' | 'declining' | 'stable' {
    if (reviews.length < 10) return 'stable';

    const sortedReviews = reviews.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const recentReviews = sortedReviews.slice(-5);
    const olderReviews = sortedReviews.slice(-10, -5);

    const recentAvg = recentReviews.reduce((sum, r) => sum + r.rating, 0) / recentReviews.length;
    const olderAvg = olderReviews.reduce((sum, r) => sum + r.rating, 0) / olderReviews.length;

    const difference = recentAvg - olderAvg;
    
    if (difference > 0.2) return 'improving';
    if (difference < -0.2) return 'declining';
    return 'stable';
  }

  private extractCommonKeywords(reviews: EnhancedReview[]): { word: string; frequency: number }[] {
    const wordCount: { [key: string]: number } = {};
    
    reviews.forEach(review => {
      const words = review.comment.toLowerCase()
        .replace(/[^a-z\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3);
      
      words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
      });
    });

    return Object.entries(wordCount)
      .map(([word, frequency]) => ({ word, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);
  }

  private calculateResponseRate(reviews: EnhancedReview[]): number {
    const reviewsWithResponses = reviews.filter(review => review.responseFromProvider);
    return reviews.length > 0 ? (reviewsWithResponses.length / reviews.length) * 100 : 0;
  }

  private calculateAverageResponseTime(reviews: EnhancedReview[]): number {
    const reviewsWithResponses = reviews.filter(review => review.responseFromProvider);
    
    if (reviewsWithResponses.length === 0) return 0;

    const totalResponseTime = reviewsWithResponses.reduce((sum, review) => {
      const reviewDate = new Date(review.date);
      const responseDate = new Date(review.responseFromProvider!.date);
      const diffHours = (responseDate.getTime() - reviewDate.getTime()) / (1000 * 60 * 60);
      return sum + diffHours;
    }, 0);

    return totalResponseTime / reviewsWithResponses.length;
  }

  // Storage methods
  private async storeReview(review: EnhancedReview): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('enhanced_reviews');
      const reviews = stored ? JSON.parse(stored) : [];
      reviews.push(review);
      await AsyncStorage.setItem('enhanced_reviews', JSON.stringify(reviews));
    } catch (error) {
      console.error('Error storing review:', error);
    }
  }

  private async getProviderReviews(providerId: string): Promise<EnhancedReview[]> {
    try {
      const stored = await AsyncStorage.getItem('enhanced_reviews');
      const reviews = stored ? JSON.parse(stored) : [];
      return reviews.filter((review: EnhancedReview) => review.providerId === providerId);
    } catch (error) {
      console.error('Error getting provider reviews:', error);
      return [];
    }
  }

  private async loadReviewPrompts(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('review_prompts');
      this.reviewPrompts = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading review prompts:', error);
    }
  }

  private async saveReviewPrompts(): Promise<void> {
    try {
      await AsyncStorage.setItem('review_prompts', JSON.stringify(this.reviewPrompts));
    } catch (error) {
      console.error('Error saving review prompts:', error);
    }
  }

  private schedulePromptChecks(): void {
    // Check for pending prompts every hour
    setInterval(async () => {
      const pendingPrompts = await this.getPendingPrompts();
      console.log(`Found ${pendingPrompts.length} pending review prompts`);
      
      // Process pending prompts (show notifications, etc.)
      for (const prompt of pendingPrompts) {
        // In a real app, you might show in-app notifications here
        console.log('Pending review prompt for:', prompt.providerName);
      }
    }, 60 * 60 * 1000); // 1 hour
  }

  // Utility methods
  async markReviewHelpful(reviewId: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('enhanced_reviews');
      const reviews = stored ? JSON.parse(stored) : [];
      
      const review = reviews.find((r: EnhancedReview) => r.id === reviewId);
      if (review) {
        review.helpfulVotes++;
        await AsyncStorage.setItem('enhanced_reviews', JSON.stringify(reviews));
      }
    } catch (error) {
      console.error('Error marking review helpful:', error);
    }
  }

  async reportReview(reviewId: string, reason: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('enhanced_reviews');
      const reviews = stored ? JSON.parse(stored) : [];
      
      const review = reviews.find((r: EnhancedReview) => r.id === reviewId);
      if (review) {
        review.reportCount++;
        await AsyncStorage.setItem('enhanced_reviews', JSON.stringify(reviews));
        
        // In a real app, send report to moderation system
        console.log('Review reported:', reviewId, reason);
      }
    } catch (error) {
      console.error('Error reporting review:', error);
    }
  }
}

export default ReviewService.getInstance();