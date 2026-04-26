// ===== API Response Wrapper =====
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// ===== Restaurant =====
export interface RestaurantInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string | null;
  instagram: string | null;
  openingTime: string;
  closingTime: string;
  hoursJson: HoursJson;
  updatedAt: string;
}

export interface DayHours {
  open: string;
  close: string;
}

export interface HoursJson {
  sunday: DayHours;
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  [key: string]: DayHours;
}

export interface FormattedHours {
  openingTime: string;
  closingTime: string;
  hoursJson: HoursJson;
  isOpen: boolean;
  todayHours: string;
  openTime: string | null;
  closeTime: string | null;
  status: string;
  timeUntilClose: string | null;
  timeUntilOpen: string | null;
}

// ===== Menu =====
export interface Category {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string | number;
  categoryId: string;
  imageUrl: string;
  isVeg: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

// ===== Gallery =====
export interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string | null;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ===== Reservation =====
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Reservation {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  partySize: number;
  reservationDate: string;
  specialRequests: string | null;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}

// ===== Auth =====
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ===== UI State =====
export interface UIState {
  isMobileMenuOpen: boolean;
  isScrolled: boolean;
}

// ===== Dashboard Stats =====
export interface DashboardStats {
  menuItemCount: number;
  categoryCount: number;
  pendingReservationCount: number;
  todayReservationCount: number;
  galleryImageCount: number;
  recentPendingReservations: Reservation[];
}
