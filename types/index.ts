export interface User {
  id: string;
  email: string;
  type: 'customer' | 'salon' | 'hairdresser';
  name: string;
  avatar?: string;
  phone?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface Customer extends User {
  type: 'customer';
  loyaltyPoints: number;
  preferredLanguage: string;
  primaryProvider?: string;
}

export interface Salon extends User {
  type: 'salon';
  businessName: string;
  description: string;
  images: string[];
  services: Service[];
  staff: Hairdresser[];
  workingHours: WorkingHours;
  rating: number;
  reviewCount: number;
  isPremium: boolean;
  qrCode?: string;
  latitude: number;
  longitude: number;
  distance?: string;
}

export interface Hairdresser extends User {
  type: 'hairdresser';
  experienceYears: number;
  specializations: string[];
  services: Service[];
  workingHours: WorkingHours;
  employmentStatus: 'salon-employed' | 'independent' | 'unavailable';
  salonId?: string;
  rating: number;
  reviewCount: number;
  portfolio: string[];
  latitude: number;
  longitude: number;
  distance?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  description?: string;
}

export interface WorkingHours {
  [key: string]: {
    isOpen: boolean;
    start?: string;
    end?: string;
  };
}

export interface Appointment {
  id: string;
  customerId: string;
  providerId: string;
  providerType: 'salon' | 'hairdresser';
  serviceId: string;
  datetime: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
  notes?: string;
  isWalkIn?: boolean;
}

export interface Review {
  id: string;
  customerId: string;
  providerId: string;
  providerType: 'salon' | 'hairdresser';
  appointmentId: string;
  rating: number;
  comment?: string;
  photos?: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}