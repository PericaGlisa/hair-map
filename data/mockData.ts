import { Salon, Hairdresser, Customer, Appointment, Review } from '@/types';

export const mockSalons: Salon[] = [
  {
    id: 'salon-1',
    email: 'contact@luxesalon.com',
    type: 'salon',
    name: 'Luxe Hair Studio',
    businessName: 'Luxe Hair Studio',
    avatar: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Premium hair salon offering cutting-edge styles and treatments',
    phone: '+1-555-0123',
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: '123 Fashion Ave, New York, NY 10001'
    },
    images: [
      'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    services: [
      { id: 'service-1', name: 'Cut & Style', duration: 60, price: 85, description: 'Professional cut and styling' },
      { id: 'service-2', name: 'Color Treatment', duration: 120, price: 150, description: 'Full color treatment' },
      { id: 'service-3', name: 'Highlights', duration: 180, price: 200, description: 'Premium highlighting service' }
    ],
    staff: [],
    workingHours: {
      monday: { isOpen: true, start: '09:00', end: '19:00' },
      tuesday: { isOpen: true, start: '09:00', end: '19:00' },
      wednesday: { isOpen: true, start: '09:00', end: '19:00' },
      thursday: { isOpen: true, start: '09:00', end: '20:00' },
      friday: { isOpen: true, start: '09:00', end: '20:00' },
      saturday: { isOpen: true, start: '08:00', end: '18:00' },
      sunday: { isOpen: false }
    },
    rating: 4.8,
    reviewCount: 247,
    isPremium: true,
    qrCode: 'LUXE_SALON_QR',
    latitude: 40.7589,
    longitude: -73.9851,
    distance: '0.3 km'
  },
  {
    id: 'salon-2',
    email: 'hello@moderncuts.com',
    type: 'salon',
    name: 'Modern Cuts',
    businessName: 'Modern Cuts',
    avatar: 'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Contemporary salon specializing in modern hairstyles',
    phone: '+1-555-0124',
    location: {
      latitude: 40.7505,
      longitude: -73.9934,
      address: '456 Style Street, New York, NY 10002'
    },
    images: [
      'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    services: [
      { id: 'service-4', name: 'Modern Cut', duration: 45, price: 65, description: 'Contemporary styling' },
      { id: 'service-5', name: 'Beard Trim', duration: 30, price: 35, description: 'Professional beard styling' }
    ],
    staff: [],
    workingHours: {
      monday: { isOpen: true, start: '10:00', end: '18:00' },
      tuesday: { isOpen: true, start: '10:00', end: '18:00' },
      wednesday: { isOpen: true, start: '10:00', end: '18:00' },
      thursday: { isOpen: true, start: '10:00', end: '19:00' },
      friday: { isOpen: true, start: '10:00', end: '19:00' },
      saturday: { isOpen: true, start: '09:00', end: '17:00' },
      sunday: { isOpen: true, start: '11:00', end: '16:00' }
    },
    rating: 4.5,
    reviewCount: 156,
    isPremium: false,
    latitude: 40.7505,
    longitude: -73.9934,
    distance: '0.8 km'
  }
];

export const mockHairdressers: Hairdresser[] = [
  {
    id: 'hairdresser-1',
    email: 'sarah@luxesalon.com',
    type: 'hairdresser',
    name: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
    phone: '+1-555-0125',
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: '123 Fashion Ave, New York, NY 10001'
    },
    experienceYears: 8,
    specializations: ['Color Specialist', 'Bridal Styling', 'Curly Hair'],
    services: [
      { id: 'service-6', name: 'Color Consultation', duration: 90, price: 120, description: 'Expert color analysis' },
      { id: 'service-7', name: 'Bridal Styling', duration: 150, price: 250, description: 'Complete bridal hair service' }
    ],
    workingHours: {
      monday: { isOpen: true, start: '09:00', end: '17:00' },
      tuesday: { isOpen: true, start: '09:00', end: '17:00' },
      wednesday: { isOpen: true, start: '09:00', end: '17:00' },
      thursday: { isOpen: true, start: '09:00', end: '17:00' },
      friday: { isOpen: true, start: '09:00', end: '17:00' },
      saturday: { isOpen: false },
      sunday: { isOpen: false }
    },
    employmentStatus: 'salon-employed',
    salonId: 'salon-1',
    rating: 4.9,
    reviewCount: 89,
    portfolio: [
      'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    latitude: 40.7589,
    longitude: -73.9851,
    distance: '0.3 km'
  },
  {
    id: 'hairdresser-2',
    email: 'mike@independent.com',
    type: 'hairdresser',
    name: 'Mike Rodriguez',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300',
    phone: '+1-555-0126',
    location: {
      latitude: 40.7614,
      longitude: -73.9776,
      address: '789 Independent St, New York, NY 10003'
    },
    experienceYears: 12,
    specializations: ['Men\'s Cuts', 'Beard Styling', 'Traditional Barbering'],
    services: [
      { id: 'service-8', name: 'Classic Cut', duration: 45, price: 55, description: 'Traditional men\'s haircut' },
      { id: 'service-9', name: 'Full Service', duration: 75, price: 85, description: 'Cut, wash, and beard trim' }
    ],
    workingHours: {
      monday: { isOpen: false },
      tuesday: { isOpen: true, start: '10:00', end: '18:00' },
      wednesday: { isOpen: true, start: '10:00', end: '18:00' },
      thursday: { isOpen: true, start: '10:00', end: '18:00' },
      friday: { isOpen: true, start: '10:00', end: '18:00' },
      saturday: { isOpen: true, start: '09:00', end: '16:00' },
      sunday: { isOpen: false }
    },
    employmentStatus: 'independent',
    rating: 4.7,
    reviewCount: 134,
    portfolio: [
      'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    latitude: 40.7614,
    longitude: -73.9776,
    distance: '0.5 km'
  }
];

export const mockCustomer: Customer = {
  id: 'customer-1',
  email: 'jane@example.com',
  type: 'customer',
  name: 'Jane Smith',
  avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
  phone: '+1-555-0127',
  loyaltyPoints: 23,
  preferredLanguage: 'en',
  primaryProvider: 'hairdresser-1',
  location: {
    latitude: 40.7580,
    longitude: -73.9855,
    address: 'New York, NY'
  }
};

export const mockAppointments: Appointment[] = [
  {
    id: 'appt-1',
    customerId: 'customer-1',
    providerId: 'hairdresser-1',
    providerType: 'hairdresser',
    serviceId: 'service-6',
    datetime: '2025-01-15T14:00:00Z',
    status: 'confirmed',
    price: 120,
    notes: 'Looking for a subtle color change'
  },
  {
    id: 'appt-2',
    customerId: 'customer-1',
    providerId: 'salon-2',
    providerType: 'salon',
    serviceId: 'service-4',
    datetime: '2025-01-10T10:30:00Z',
    status: 'completed',
    price: 65
  }
];

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    customerId: 'customer-1',
    providerId: 'hairdresser-1',
    providerType: 'hairdresser',
    appointmentId: 'appt-2',
    rating: 5,
    comment: 'Amazing color work! Sarah really knows what she\'s doing.',
    createdAt: '2025-01-11T16:00:00Z'
  }
];

export const mockMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'customer-1',
    receiverId: 'hairdresser-1',
    message: 'Hi Sarah! I\'m excited about my appointment tomorrow. Any preparation needed?',
    timestamp: '2025-01-14T18:30:00Z',
    isRead: true
  },
  {
    id: 'msg-2',
    senderId: 'hairdresser-1',
    receiverId: 'customer-1',
    message: 'Hi Jane! Just come with clean, dry hair. Looking forward to seeing you!',
    timestamp: '2025-01-14T19:15:00Z',
    isRead: false
  }
];