
export type UserRole = 'GUEST' | 'HOST' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  bio?: string;
  isVerified: boolean;
  joinedDate: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Listing {
  id: string;
  hostId: string;
  title: string;
  description: string;
  pricePerNight: number;
  type: 'ENTIRE_HOME' | 'PRIVATE_ROOM' | 'SHARED_ROOM';
  location: {
    address: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  images: string[];
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  houseRules: string[];
}

export interface Booking {
  id: string;
  listingId: string;
  guestId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED';
  guestCount: number;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}
