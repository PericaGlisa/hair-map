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
    staff: ['hairdresser-1', 'hairdresser-3', 'hairdresser-4', 'hairdresser-5', 'hairdresser-6'],
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
    distance: '0.3 km',
    availableSlots: ['10:00', '14:00', '16:30']
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
    staff: ['hairdresser-2', 'hairdresser-7', 'hairdresser-8'],
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
    distance: '0.8 km',
    availableSlots: ['11:00', '13:30', '15:00', '17:00']
  },
  {
    id: 'salon-3',
    email: 'info@elegancesalon.com',
    type: 'salon',
    name: 'Elegance Salon',
    businessName: 'Elegance Salon',
    avatar: 'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Elegant salon with experienced stylists',
    phone: '+1-555-0125',
    location: {
      latitude: 40.7614,
      longitude: -73.9776,
      address: '789 Elegance Blvd, New York, NY 10003'
    },
    images: [
      'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    services: [
      { id: 'service-10', name: 'Premium Cut', duration: 75, price: 95, description: 'Luxury hair cutting service' },
      { id: 'service-11', name: 'Hair Treatment', duration: 90, price: 120, description: 'Deep conditioning treatment' }
    ],
    staff: ['hairdresser-9', 'hairdresser-10'],
    workingHours: {
      monday: { isOpen: true, start: '09:00', end: '18:00' },
      tuesday: { isOpen: true, start: '09:00', end: '18:00' },
      wednesday: { isOpen: true, start: '09:00', end: '18:00' },
      thursday: { isOpen: true, start: '09:00', end: '19:00' },
      friday: { isOpen: true, start: '09:00', end: '19:00' },
      saturday: { isOpen: true, start: '08:00', end: '17:00' },
      sunday: { isOpen: false }
    },
    rating: 4.6,
    reviewCount: 89,
    isPremium: true,
    latitude: 40.7614,
    longitude: -73.9776,
    distance: '0.5 km',
    availableSlots: ['09:30', '12:00', '15:30']
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
      'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    latitude: 40.7589,
    longitude: -73.9851,
    distance: '0.3 km'
  },
  {
    id: 'hairdresser-2',
    email: 'mike@moderncuts.com',
    type: 'hairdresser',
    name: 'Mike Rodriguez',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300',
    phone: '+1-555-0126',
    location: {
      latitude: 40.7505,
      longitude: -73.9934,
      address: '456 Style Street, New York, NY 10002'
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
    employmentStatus: 'salon-employed',
    salonId: 'salon-2',
    rating: 4.7,
    reviewCount: 134,
    portfolio: [
      'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    latitude: 40.7505,
    longitude: -73.9934,
    distance: '0.8 km'
  },
  {
    id: 'hairdresser-3',
    email: 'emma@luxesalon.com',
    type: 'hairdresser',
    name: 'Emma Wilson',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=300',
    phone: '+1-555-0127',
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: '123 Fashion Ave, New York, NY 10001'
    },
    experienceYears: 6,
    specializations: ['Balayage', 'Extensions', 'Updos'],
    services: [
      { id: 'service-12', name: 'Balayage', duration: 180, price: 220, description: 'Hand-painted highlights' },
      { id: 'service-13', name: 'Hair Extensions', duration: 120, price: 180, description: 'Professional extension application' }
    ],
    workingHours: {
      monday: { isOpen: true, start: '10:00', end: '18:00' },
      tuesday: { isOpen: true, start: '10:00', end: '18:00' },
      wednesday: { isOpen: true, start: '10:00', end: '18:00' },
      thursday: { isOpen: true, start: '10:00', end: '19:00' },
      friday: { isOpen: true, start: '10:00', end: '19:00' },
      saturday: { isOpen: true, start: '09:00', end: '17:00' },
      sunday: { isOpen: false }
    },
    employmentStatus: 'salon-employed',
    salonId: 'salon-1',
    rating: 4.8,
    reviewCount: 67,
    portfolio: [
      'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    latitude: 40.7589,
    longitude: -73.9851,
    distance: '0.3 km'
  },
  {
    id: 'hairdresser-4',
    email: 'alex@luxesalon.com',
    type: 'hairdresser',
    name: 'Alex Chen',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300',
    phone: '+1-555-0128',
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: '123 Fashion Ave, New York, NY 10001'
    },
    experienceYears: 10,
    specializations: ['Asian Hair', 'Keratin Treatments', 'Precision Cuts'],
    services: [
      { id: 'service-14', name: 'Keratin Treatment', duration: 150, price: 200, description: 'Smoothing treatment' },
      { id: 'service-15', name: 'Precision Cut', duration: 60, price: 90, description: 'Detailed precision cutting' }
    ],
    workingHours: {
      monday: { isOpen: true, start: '09:00', end: '17:00' },
      tuesday: { isOpen: true, start: '09:00', end: '17:00' },
      wednesday: { isOpen: false },
      thursday: { isOpen: true, start: '09:00', end: '17:00' },
      friday: { isOpen: true, start: '09:00', end: '17:00' },
      saturday: { isOpen: true, start: '08:00', end: '16:00' },
      sunday: { isOpen: false }
    },
    employmentStatus: 'salon-employed',
    salonId: 'salon-1',
    rating: 4.9,
    reviewCount: 112,
    portfolio: [
      'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    latitude: 40.7589,
    longitude: -73.9851,
    distance: '0.3 km'
  },
  {
    id: 'hairdresser-5',
    email: 'maria@luxesalon.com',
    type: 'hairdresser',
    name: 'Maria Garcia',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
    phone: '+1-555-0129',
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: '123 Fashion Ave, New York, NY 10001'
    },
    experienceYears: 7,
    specializations: ['Curly Hair', 'Natural Textures', 'Hair Repair'],
    services: [
      { id: 'service-16', name: 'Curly Cut', duration: 75, price: 95, description: 'Specialized curly hair cutting' },
      { id: 'service-17', name: 'Deep Conditioning', duration: 60, price: 70, description: 'Intensive hair treatment' }
    ],
    workingHours: {
      monday: { isOpen: true, start: '11:00', end: '19:00' },
      tuesday: { isOpen: true, start: '11:00', end: '19:00' },
      wednesday: { isOpen: true, start: '11:00', end: '19:00' },
      thursday: { isOpen: true, start: '11:00', end: '19:00' },
      friday: { isOpen: true, start: '11:00', end: '19:00' },
      saturday: { isOpen: false },
      sunday: { isOpen: true, start: '10:00', end: '16:00' }
    },
    employmentStatus: 'salon-employed',
    salonId: 'salon-1',
    rating: 4.7,
    reviewCount: 78,
    portfolio: [
      'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    latitude: 40.7589,
    longitude: -73.9851,
    distance: '0.3 km'
  },
  {
    id: 'hairdresser-6',
    email: 'david@luxesalon.com',
    type: 'hairdresser',
    name: 'David Thompson',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300',
    phone: '+1-555-0130',
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: '123 Fashion Ave, New York, NY 10001'
    },
    experienceYears: 15,
    specializations: ['Creative Color', 'Fashion Cuts', 'Editorial Styling'],
    services: [
      { id: 'service-18', name: 'Creative Color', duration: 200, price: 280, description: 'Artistic color design' },
      { id: 'service-19', name: 'Fashion Cut', duration: 90, price: 110, description: 'Trendy fashion-forward cuts' }
    ],
    workingHours: {
      monday: { isOpen: false },
      tuesday: { isOpen: true, start: '10:00', end: '18:00' },
      wednesday: { isOpen: true, start: '10:00', end: '18:00' },
      thursday: { isOpen: true, start: '10:00', end: '18:00' },
      friday: { isOpen: true, start: '10:00', end: '18:00' },
      saturday: { isOpen: true, start: '09:00', end: '17:00' },
      sunday: { isOpen: false }
    },
    employmentStatus: 'salon-employed',
    salonId: 'salon-1',
    rating: 4.9,
    reviewCount: 156,
    portfolio: [
      'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    latitude: 40.7589,
    longitude: -73.9851,
    distance: '0.3 km'
  },
  {
    id: 'hairdresser-7',
    email: 'lisa@moderncuts.com',
    type: 'hairdresser',
    name: 'Lisa Brown',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300',
    phone: '+1-555-0131',
    location: {
      latitude: 40.7505,
      longitude: -73.9934,
      address: '456 Style Street, New York, NY 10002'
    },
    experienceYears: 9,
    specializations: ['Blowouts', 'Layered Cuts', 'Color Correction'],
    services: [
      { id: 'service-20', name: 'Signature Blowout', duration: 45, price: 60, description: 'Professional styling' },
      { id: 'service-21', name: 'Color Correction', duration: 240, price: 300, description: 'Fix previous color mistakes' }
    ],
    workingHours: {
      monday: { isOpen: true, start: '10:00', end: '18:00' },
      tuesday: { isOpen: true, start: '10:00', end: '18:00' },
      wednesday: { isOpen: true, start: '10:00', end: '18:00' },
      thursday: { isOpen: true, start: '10:00', end: '19:00' },
      friday: { isOpen: true, start: '10:00', end: '19:00' },
      saturday: { isOpen: true, start: '09:00', end: '17:00' },
      sunday: { isOpen: false }
    },
    employmentStatus: 'salon-employed',
    salonId: 'salon-2',
    rating: 4.6,
    reviewCount: 94,
    portfolio: [
      'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    latitude: 40.7505,
    longitude: -73.9934,
    distance: '0.8 km'
  },
  {
    id: 'hairdresser-8',
    email: 'james@moderncuts.com',
    type: 'hairdresser',
    name: 'James Wilson',
    avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300',
    phone: '+1-555-0132',
    location: {
      latitude: 40.7505,
      longitude: -73.9934,
      address: '456 Style Street, New York, NY 10002'
    },
    experienceYears: 5,
    specializations: ['Fade Cuts', 'Modern Styling', 'Hair Washing'],
    services: [
      { id: 'service-22', name: 'Modern Fade', duration: 40, price: 50, description: 'Contemporary fade cuts' },
      { id: 'service-23', name: 'Wash & Style', duration: 30, price: 40, description: 'Quick wash and style' }
    ],
    workingHours: {
      monday: { isOpen: true, start: '11:00', end: '19:00' },
      tuesday: { isOpen: true, start: '11:00', end: '19:00' },
      wednesday: { isOpen: true, start: '11:00', end: '19:00' },
      thursday: { isOpen: true, start: '11:00', end: '19:00' },
      friday: { isOpen: true, start: '11:00', end: '19:00' },
      saturday: { isOpen: true, start: '10:00', end: '18:00' },
      sunday: { isOpen: true, start: '12:00', end: '17:00' }
    },
    employmentStatus: 'salon-employed',
    salonId: 'salon-2',
    rating: 4.4,
    reviewCount: 52,
    portfolio: [
      'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    latitude: 40.7505,
    longitude: -73.9934,
    distance: '0.8 km'
  },
  {
    id: 'hairdresser-9',
    email: 'sophia@elegancesalon.com',
    type: 'hairdresser',
    name: 'Sophia Martinez',
    avatar: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=300',
    phone: '+1-555-0133',
    location: {
      latitude: 40.7614,
      longitude: -73.9776,
      address: '789 Elegance Blvd, New York, NY 10003'
    },
    experienceYears: 11,
    specializations: ['Luxury Treatments', 'Scalp Care', 'Premium Styling'],
    services: [
      { id: 'service-24', name: 'Luxury Treatment', duration: 120, price: 150, description: 'Premium hair treatment' },
      { id: 'service-25', name: 'Scalp Massage', duration: 30, price: 45, description: 'Relaxing scalp treatment' }
    ],
    workingHours: {
      monday: { isOpen: true, start: '09:00', end: '17:00' },
      tuesday: { isOpen: true, start: '09:00', end: '17:00' },
      wednesday: { isOpen: true, start: '09:00', end: '17:00' },
      thursday: { isOpen: true, start: '09:00', end: '18:00' },
      friday: { isOpen: true, start: '09:00', end: '18:00' },
      saturday: { isOpen: true, start: '08:00', end: '16:00' },
      sunday: { isOpen: false }
    },
    employmentStatus: 'salon-employed',
    salonId: 'salon-3',
    rating: 4.8,
    reviewCount: 87,
    portfolio: [
      'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    latitude: 40.7614,
    longitude: -73.9776,
    distance: '0.5 km'
  },
  {
    id: 'hairdresser-10',
    email: 'robert@elegancesalon.com',
    type: 'hairdresser',
    name: 'Robert Davis',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300',
    phone: '+1-555-0134',
    location: {
      latitude: 40.7614,
      longitude: -73.9776,
      address: '789 Elegance Blvd, New York, NY 10003'
    },
    experienceYears: 13,
    specializations: ['Classic Cuts', 'Gentleman\'s Grooming', 'Traditional Styling'],
    services: [
      { id: 'service-26', name: 'Gentleman\'s Cut', duration: 60, price: 80, description: 'Classic men\'s styling' },
      { id: 'service-27', name: 'Traditional Shave', duration: 45, price: 60, description: 'Hot towel shave service' }
    ],
    workingHours: {
      monday: { isOpen: true, start: '10:00', end: '18:00' },
      tuesday: { isOpen: true, start: '10:00', end: '18:00' },
      wednesday: { isOpen: false },
      thursday: { isOpen: true, start: '10:00', end: '18:00' },
      friday: { isOpen: true, start: '10:00', end: '18:00' },
      saturday: { isOpen: true, start: '09:00', end: '17:00' },
      sunday: { isOpen: false }
    },
    employmentStatus: 'salon-employed',
    salonId: 'salon-3',
    rating: 4.7,
    reviewCount: 103,
    portfolio: [
      'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=400'
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
  },
  {
    id: 'review-2',
    customerId: 'customer-2',
    providerId: 'hairdresser-1',
    providerType: 'hairdresser',
    appointmentId: 'appt-3',
    rating: 5,
    comment: 'Sarah is fantastic! My hair has never looked better.',
    createdAt: '2025-01-10T14:30:00Z'
  },
  {
    id: 'review-3',
    customerId: 'customer-3',
    providerId: 'hairdresser-2',
    providerType: 'hairdresser',
    appointmentId: 'appt-4',
    rating: 5,
    comment: 'Mike is a true master of men\'s hairstyles. Highly recommend!',
    createdAt: '2025-01-09T11:15:00Z'
  },
  {
    id: 'review-4',
    customerId: 'customer-4',
    providerId: 'hairdresser-3',
    providerType: 'hairdresser',
    appointmentId: 'appt-5',
    rating: 5,
    comment: 'Emma did a perfect balayage. I\'m thrilled!',
    createdAt: '2025-01-08T16:45:00Z'
  },
  {
    id: 'review-5',
    customerId: 'customer-5',
    providerId: 'hairdresser-4',
    providerType: 'hairdresser',
    appointmentId: 'appt-6',
    rating: 5,
    comment: 'Alex understands Asian hair like no one else. Excellent work!',
    createdAt: '2025-01-07T13:20:00Z'
  },
  {
    id: 'review-6',
    customerId: 'customer-6',
    providerId: 'hairdresser-5',
    providerType: 'hairdresser',
    appointmentId: 'appt-7',
    rating: 4,
    comment: 'Maria is an expert with curly hair. Very satisfied!',
    createdAt: '2025-01-06T10:30:00Z'
  },
  {
    id: 'review-7',
    customerId: 'customer-7',
    providerId: 'hairdresser-6',
    providerType: 'hairdresser',
    appointmentId: 'appt-8',
    rating: 5,
    comment: 'David is a creative genius! My new color is spectacular.',
    createdAt: '2025-01-05T15:10:00Z'
  },
  {
    id: 'review-8',
    customerId: 'customer-8',
    providerId: 'hairdresser-7',
    providerType: 'hairdresser',
    appointmentId: 'appt-9',
    rating: 4,
    comment: 'Lisa does the best blowout hairstyles in the city!',
    createdAt: '2025-01-04T12:45:00Z'
  },
  {
    id: 'review-9',
    customerId: 'customer-9',
    providerId: 'hairdresser-8',
    providerType: 'hairdresser',
    appointmentId: 'appt-10',
    rating: 4,
    comment: 'James is young but very talented. Excellent fade!',
    createdAt: '2025-01-03T14:20:00Z'
  },
  {
    id: 'review-10',
    customerId: 'customer-10',
    providerId: 'hairdresser-9',
    providerType: 'hairdresser',
    appointmentId: 'appt-11',
    rating: 5,
    comment: 'Sophia provides a luxurious experience. I recommend her to everyone!',
    createdAt: '2025-01-02T11:30:00Z'
  },
  {
    id: 'review-11',
    customerId: 'customer-11',
    providerId: 'hairdresser-10',
    providerType: 'hairdresser',
    appointmentId: 'appt-12',
    rating: 5,
    comment: 'Robert is a classic gentleman barber. Excellent work!',
    createdAt: '2025-01-01T16:00:00Z'
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