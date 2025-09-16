import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appointment, Review, Salon, Hairdresser } from '@/types';
import NotificationService from './NotificationService';
import { EnhancedReview } from './ReviewService';

export interface AIInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'optimization' | 'trend';
  title: string;
  description: string;
  confidence: number; // 0-100
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  expiresAt?: Date;
}

export interface CustomerBehaviorPattern {
  customerId: string;
  preferredTimeSlots: string[];
  preferredServices: string[];
  averageBookingAdvance: number; // days
  cancellationRate: number;
  noShowRate: number;
  averageSpending: number;
  loyaltyScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
}

export interface QualityMetrics {
  providerId: string;
  overallScore: number; // 0-100
  punctualityScore: number;
  serviceQualityScore: number;
  customerSatisfactionScore: number;
  consistencyScore: number;
  improvementTrend: 'improving' | 'declining' | 'stable';
  riskFactors: string[];
  strengths: string[];
}

export interface PredictiveAnalytics {
  demandForecast: {
    date: Date;
    expectedBookings: number;
    confidence: number;
  }[];
  revenueProjection: {
    period: 'week' | 'month' | 'quarter';
    projected: number;
    confidence: number;
  };
  churnRisk: {
    customerId: string;
    riskScore: number;
    reasons: string[];
  }[];
}

class AIService {
  private static instance: AIService;
  private insights: AIInsight[] = [];
  private customerPatterns: Map<string, CustomerBehaviorPattern> = new Map();
  private qualityMetrics: Map<string, QualityMetrics> = new Map();

  private constructor() {
    this.loadStoredData();
    this.startPeriodicAnalysis();
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // AI-Powered Appointment Reminders
  async generateSmartReminder(
    appointment: Appointment,
    customerPattern: CustomerBehaviorPattern
  ): Promise<{ message: string; timing: Date; channel: 'push' | 'sms' | 'email' }> {
    try {
      const appointmentDate = new Date(appointment.date);
      const now = new Date();
      const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      // Determine optimal reminder timing based on customer behavior
      let reminderHours = 24; // Default 24 hours before
      
      if (customerPattern.noShowRate > 0.2) {
        reminderHours = 2; // High-risk customers get closer reminders
      } else if (customerPattern.averageBookingAdvance > 7) {
        reminderHours = 48; // Planners get earlier reminders
      }

      // Generate personalized message
      const message = this.generatePersonalizedMessage(appointment, customerPattern);
      
      // Determine best communication channel
      const channel = this.selectOptimalChannel(customerPattern);
      
      const reminderTime = new Date(appointmentDate.getTime() - reminderHours * 60 * 60 * 1000);

      return {
        message,
        timing: reminderTime,
        channel,
      };
    } catch (error) {
      console.error('Error generating smart reminder:', error);
      // Fallback to standard reminder
      return {
        message: `Reminder: You have an appointment tomorrow at ${appointment.time}`,
        timing: new Date(new Date(appointment.date).getTime() - 24 * 60 * 60 * 1000),
        channel: 'push',
      };
    }
  }

  private generatePersonalizedMessage(
    appointment: Appointment,
    customerPattern: CustomerBehaviorPattern
  ): string {
    const templates = {
      loyal: [
        `Hi! Your ${appointment.service} appointment is coming up. We're excited to see you again!`,
        `Looking forward to your visit! Your ${appointment.service} is scheduled for tomorrow.`,
      ],
      newCustomer: [
        `Welcome! Don't forget about your first ${appointment.service} appointment with us tomorrow.`,
        `We're excited to meet you! Your ${appointment.service} appointment is tomorrow.`,
      ],
      riskCustomer: [
        `Important reminder: Your ${appointment.service} appointment is tomorrow. Please confirm or reschedule if needed.`,
        `Just checking in - your appointment is tomorrow. Let us know if you need to make any changes.`,
      ],
      regular: [
        `Reminder: Your ${appointment.service} appointment is tomorrow at ${appointment.time}.`,
        `Don't forget - you have a ${appointment.service} appointment coming up!`,
      ],
    };

    let category = 'regular';
    if (customerPattern.loyaltyScore > 80) {
      category = 'loyal';
    } else if (customerPattern.loyaltyScore < 20) {
      category = 'newCustomer';
    } else if (customerPattern.noShowRate > 0.15 || customerPattern.cancellationRate > 0.25) {
      category = 'riskCustomer';
    }

    const categoryTemplates = templates[category as keyof typeof templates];
    return categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
  }

  private selectOptimalChannel(customerPattern: CustomerBehaviorPattern): 'push' | 'sms' | 'email' {
    // High-risk customers get SMS for better visibility
    if (customerPattern.riskLevel === 'high') {
      return 'sms';
    }
    
    // Loyal customers prefer less intrusive push notifications
    if (customerPattern.loyaltyScore > 70) {
      return 'push';
    }
    
    // Default to push notifications
    return 'push';
  }

  // Quality Assurance Algorithms
  async analyzeServiceQuality(
    providerId: string,
    reviews: EnhancedReview[],
    appointments: Appointment[]
  ): Promise<QualityMetrics> {
    try {
      const metrics = await this.calculateQualityMetrics(providerId, reviews, appointments);
      this.qualityMetrics.set(providerId, metrics);
      await this.saveQualityMetrics();
      
      // Generate insights based on quality analysis
      await this.generateQualityInsights(metrics);
      
      return metrics;
    } catch (error) {
      console.error('Error analyzing service quality:', error);
      throw error;
    }
  }

  private async calculateQualityMetrics(
    providerId: string,
    reviews: EnhancedReview[],
    appointments: Appointment[]
  ): Promise<QualityMetrics> {
    // Calculate punctuality score
    const punctualityScore = this.calculatePunctualityScore(appointments);
    
    // Calculate service quality score from reviews
    const serviceQualityScore = this.calculateServiceQualityScore(reviews);
    
    // Calculate customer satisfaction score
    const customerSatisfactionScore = this.calculateSatisfactionScore(reviews);
    
    // Calculate consistency score
    const consistencyScore = this.calculateConsistencyScore(reviews);
    
    // Calculate overall score
    const overallScore = (
      punctualityScore * 0.25 +
      serviceQualityScore * 0.35 +
      customerSatisfactionScore * 0.25 +
      consistencyScore * 0.15
    );
    
    // Determine improvement trend
    const improvementTrend = this.calculateImprovementTrend(reviews);
    
    // Identify risk factors and strengths
    const riskFactors = this.identifyRiskFactors({
      punctualityScore,
      serviceQualityScore,
      customerSatisfactionScore,
      consistencyScore,
    });
    
    const strengths = this.identifyStrengths({
      punctualityScore,
      serviceQualityScore,
      customerSatisfactionScore,
      consistencyScore,
    });

    return {
      providerId,
      overallScore,
      punctualityScore,
      serviceQualityScore,
      customerSatisfactionScore,
      consistencyScore,
      improvementTrend,
      riskFactors,
      strengths,
    };
  }

  private calculatePunctualityScore(appointments: Appointment[]): number {
    if (appointments.length === 0) return 100;
    
    const onTimeAppointments = appointments.filter(apt => {
      // Simulate punctuality data - in real app, this would come from actual data
      return Math.random() > 0.15; // 85% on-time rate
    });
    
    return (onTimeAppointments.length / appointments.length) * 100;
  }

  private calculateServiceQualityScore(reviews: EnhancedReview[]): number {
    if (reviews.length === 0) return 0;
    
    const qualityKeywords = [
      'excellent', 'amazing', 'professional', 'skilled', 'talented',
      'perfect', 'outstanding', 'exceptional', 'wonderful', 'fantastic'
    ];
    
    const qualityReviews = reviews.filter(review => {
      const comment = review.comment.toLowerCase();
      return qualityKeywords.some(keyword => comment.includes(keyword)) || review.rating >= 4;
    });
    
    return (qualityReviews.length / reviews.length) * 100;
  }

  private calculateSatisfactionScore(reviews: EnhancedReview[]): number {
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / (reviews.length * 5)) * 100;
  }

  private calculateConsistencyScore(reviews: EnhancedReview[]): number {
    if (reviews.length < 3) return 100;
    
    const ratings = reviews.map(r => r.rating);
    const mean = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    const variance = ratings.reduce((sum, rating) => sum + Math.pow(rating - mean, 2), 0) / ratings.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Lower standard deviation = higher consistency
    // Scale to 0-100 where 0 std dev = 100 score
    return Math.max(0, 100 - (standardDeviation * 25));
  }

  private calculateImprovementTrend(reviews: EnhancedReview[]): 'improving' | 'declining' | 'stable' {
    if (reviews.length < 6) return 'stable';
    
    const sortedReviews = reviews.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const recentReviews = sortedReviews.slice(-3);
    const olderReviews = sortedReviews.slice(-6, -3);
    
    const recentAvg = recentReviews.reduce((sum, r) => sum + r.rating, 0) / recentReviews.length;
    const olderAvg = olderReviews.reduce((sum, r) => sum + r.rating, 0) / olderReviews.length;
    
    const difference = recentAvg - olderAvg;
    
    if (difference > 0.3) return 'improving';
    if (difference < -0.3) return 'declining';
    return 'stable';
  }

  private identifyRiskFactors(scores: {
    punctualityScore: number;
    serviceQualityScore: number;
    customerSatisfactionScore: number;
    consistencyScore: number;
  }): string[] {
    const risks: string[] = [];
    
    if (scores.punctualityScore < 70) {
      risks.push('Poor punctuality affecting customer experience');
    }
    if (scores.serviceQualityScore < 60) {
      risks.push('Service quality concerns based on customer feedback');
    }
    if (scores.customerSatisfactionScore < 65) {
      risks.push('Below-average customer satisfaction ratings');
    }
    if (scores.consistencyScore < 50) {
      risks.push('Inconsistent service delivery');
    }
    
    return risks;
  }

  private identifyStrengths(scores: {
    punctualityScore: number;
    serviceQualityScore: number;
    customerSatisfactionScore: number;
    consistencyScore: number;
  }): string[] {
    const strengths: string[] = [];
    
    if (scores.punctualityScore > 85) {
      strengths.push('Excellent punctuality and time management');
    }
    if (scores.serviceQualityScore > 80) {
      strengths.push('High-quality service delivery');
    }
    if (scores.customerSatisfactionScore > 85) {
      strengths.push('Outstanding customer satisfaction');
    }
    if (scores.consistencyScore > 80) {
      strengths.push('Consistent service quality');
    }
    
    return strengths;
  }

  // Customer Behavior Analysis
  async analyzeCustomerBehavior(
    customerId: string,
    appointments: Appointment[],
    reviews: Review[]
  ): Promise<CustomerBehaviorPattern> {
    try {
      const pattern = await this.calculateCustomerPattern(customerId, appointments, reviews);
      this.customerPatterns.set(customerId, pattern);
      await this.saveCustomerPatterns();
      
      return pattern;
    } catch (error) {
      console.error('Error analyzing customer behavior:', error);
      throw error;
    }
  }

  private async calculateCustomerPattern(
    customerId: string,
    appointments: Appointment[],
    reviews: Review[]
  ): Promise<CustomerBehaviorPattern> {
    // Calculate preferred time slots
    const timeSlots = appointments.map(apt => {
      const hour = new Date(apt.date).getHours();
      if (hour < 12) return 'morning';
      if (hour < 17) return 'afternoon';
      return 'evening';
    });
    
    const preferredTimeSlots = this.getMostFrequent(timeSlots);
    
    // Calculate preferred services
    const services = appointments.map(apt => apt.service);
    const preferredServices = this.getMostFrequent(services);
    
    // Calculate average booking advance
    const bookingAdvances = appointments.map(apt => {
      // Simulate booking advance data
      return Math.floor(Math.random() * 14) + 1; // 1-14 days
    });
    const averageBookingAdvance = bookingAdvances.reduce((sum, days) => sum + days, 0) / bookingAdvances.length;
    
    // Calculate cancellation and no-show rates
    const totalAppointments = appointments.length;
    const cancelledAppointments = Math.floor(totalAppointments * 0.1); // Simulate 10% cancellation
    const noShowAppointments = Math.floor(totalAppointments * 0.05); // Simulate 5% no-show
    
    const cancellationRate = cancelledAppointments / totalAppointments;
    const noShowRate = noShowAppointments / totalAppointments;
    
    // Calculate average spending
    const averageSpending = appointments.reduce((sum, apt) => sum + (apt.price || 50), 0) / appointments.length;
    
    // Calculate loyalty score
    const loyaltyScore = this.calculateLoyaltyScore(appointments, reviews, cancellationRate, noShowRate);
    
    // Determine risk level
    const riskLevel = this.calculateRiskLevel(cancellationRate, noShowRate, loyaltyScore);

    return {
      customerId,
      preferredTimeSlots,
      preferredServices,
      averageBookingAdvance,
      cancellationRate,
      noShowRate,
      averageSpending,
      loyaltyScore,
      riskLevel,
    };
  }

  private getMostFrequent<T>(items: T[]): T[] {
    const frequency: { [key: string]: number } = {};
    
    items.forEach(item => {
      const key = String(item);
      frequency[key] = (frequency[key] || 0) + 1;
    });
    
    const maxFreq = Math.max(...Object.values(frequency));
    return Object.keys(frequency)
      .filter(key => frequency[key] === maxFreq)
      .map(key => items.find(item => String(item) === key)!)
      .filter((item, index, arr) => arr.indexOf(item) === index);
  }

  private calculateLoyaltyScore(
    appointments: Appointment[],
    reviews: Review[],
    cancellationRate: number,
    noShowRate: number
  ): number {
    let score = 50; // Base score
    
    // Appointment frequency bonus
    if (appointments.length > 10) score += 20;
    else if (appointments.length > 5) score += 10;
    
    // Review engagement bonus
    if (reviews.length > 0) {
      score += Math.min(reviews.length * 5, 20);
    }
    
    // Reliability bonus/penalty
    score -= cancellationRate * 30;
    score -= noShowRate * 40;
    
    // Recent activity bonus
    const recentAppointments = appointments.filter(apt => {
      const daysSince = (Date.now() - new Date(apt.date).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 90;
    });
    
    if (recentAppointments.length > 0) score += 10;
    
    return Math.max(0, Math.min(100, score));
  }

  private calculateRiskLevel(
    cancellationRate: number,
    noShowRate: number,
    loyaltyScore: number
  ): 'low' | 'medium' | 'high' {
    const riskScore = (cancellationRate + noShowRate) * 100 - loyaltyScore;
    
    if (riskScore > 30) return 'high';
    if (riskScore > 10) return 'medium';
    return 'low';
  }

  // Insights Generation
  private async generateQualityInsights(metrics: QualityMetrics): Promise<void> {
    const insights: AIInsight[] = [];
    
    // Generate insights based on quality metrics
    if (metrics.overallScore < 70) {
      insights.push({
        id: `quality_warning_${Date.now()}`,
        type: 'warning',
        title: 'Service Quality Alert',
        description: `Overall quality score is ${metrics.overallScore.toFixed(1)}%. Consider reviewing service processes.`,
        confidence: 85,
        actionable: true,
        priority: 'high',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
    }
    
    if (metrics.improvementTrend === 'improving') {
      insights.push({
        id: `improvement_trend_${Date.now()}`,
        type: 'trend',
        title: 'Positive Trend Detected',
        description: 'Service quality is improving based on recent customer feedback.',
        confidence: 75,
        actionable: false,
        priority: 'low',
        createdAt: new Date(),
      });
    }
    
    // Add insights to collection
    this.insights.push(...insights);
    await this.saveInsights();
  }

  // Data persistence
  private async loadStoredData(): Promise<void> {
    try {
      await Promise.all([
        this.loadInsights(),
        this.loadCustomerPatterns(),
        this.loadQualityMetrics(),
      ]);
    } catch (error) {
      console.error('Error loading stored AI data:', error);
    }
  }

  private async saveInsights(): Promise<void> {
    try {
      await AsyncStorage.setItem('ai_insights', JSON.stringify(this.insights));
    } catch (error) {
      console.error('Error saving insights:', error);
    }
  }

  private async loadInsights(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('ai_insights');
      if (stored) {
        this.insights = JSON.parse(stored).map((insight: any) => ({
          ...insight,
          createdAt: new Date(insight.createdAt),
          expiresAt: insight.expiresAt ? new Date(insight.expiresAt) : undefined,
        }));
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  }

  private async saveCustomerPatterns(): Promise<void> {
    try {
      const patternsArray = Array.from(this.customerPatterns.entries());
      await AsyncStorage.setItem('customer_patterns', JSON.stringify(patternsArray));
    } catch (error) {
      console.error('Error saving customer patterns:', error);
    }
  }

  private async loadCustomerPatterns(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('customer_patterns');
      if (stored) {
        const patternsArray = JSON.parse(stored);
        this.customerPatterns = new Map(patternsArray);
      }
    } catch (error) {
      console.error('Error loading customer patterns:', error);
    }
  }

  private async saveQualityMetrics(): Promise<void> {
    try {
      const metricsArray = Array.from(this.qualityMetrics.entries());
      await AsyncStorage.setItem('quality_metrics', JSON.stringify(metricsArray));
    } catch (error) {
      console.error('Error saving quality metrics:', error);
    }
  }

  private async loadQualityMetrics(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('quality_metrics');
      if (stored) {
        const metricsArray = JSON.parse(stored);
        this.qualityMetrics = new Map(metricsArray);
      }
    } catch (error) {
      console.error('Error loading quality metrics:', error);
    }
  }

  private startPeriodicAnalysis(): void {
    // Run analysis every 6 hours
    setInterval(async () => {
      try {
        await this.performPeriodicAnalysis();
      } catch (error) {
        console.error('Error in periodic analysis:', error);
      }
    }, 6 * 60 * 60 * 1000);
  }

  private async performPeriodicAnalysis(): Promise<void> {
    console.log('Running periodic AI analysis...');
    
    // Clean up expired insights
    const now = new Date();
    this.insights = this.insights.filter(insight => 
      !insight.expiresAt || insight.expiresAt > now
    );
    
    await this.saveInsights();
  }

  // Public API methods
  async getInsights(type?: AIInsight['type']): Promise<AIInsight[]> {
    if (type) {
      return this.insights.filter(insight => insight.type === type);
    }
    return [...this.insights];
  }

  async getCustomerPattern(customerId: string): Promise<CustomerBehaviorPattern | null> {
    return this.customerPatterns.get(customerId) || null;
  }

  async getQualityMetrics(providerId: string): Promise<QualityMetrics | null> {
    return this.qualityMetrics.get(providerId) || null;
  }

  async dismissInsight(insightId: string): Promise<void> {
    this.insights = this.insights.filter(insight => insight.id !== insightId);
    await this.saveInsights();
  }
}

export default AIService.getInstance();}}}