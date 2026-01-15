export type User = {
  _id?: string;
  id?: string;
  email: string;
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
  avatar?: string;
  role?: "user" | "admin";
  isActive?: boolean;
  isLocked?: boolean;
};

export type Movie = {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  posterUrl?: string;
  description: string;
  trailerUrl?: string;
  rating?: number;
  duration: number;
  releaseDate: string;
  genres: string[];
  director?: string;
  cast?: string[];
  language?: string;
  ageRating?: string;
  isNowShowing?: boolean;
  status?: "now-showing" | "coming-soon" | "ended";
};

export type Theater = {
  _id?: string;
  id?: string;
  name: string;
  address: string;
  city?: string;
  phone?: string;
  totalSeats: number;
  rows?: number[];
  isActive?: boolean;
};

export type Showtime = {
  _id?: string;
  id?: string;
  movieId: string | Movie;
  theaterId: string | Theater;
  startTime: string;
  endTime: string;
  price?: number;
  screenNumber?: number;
  format?: string;
  language?: string;
  subtitles?: string;
  seats?: Array<{
    row: string;
    number: number;
    isAvailable: boolean;
    price: number;
  }>;
  room?: string;
  availableSeats?: number;
  totalSeats?: number;
};

export type Seat = {
  id: string;
  showtimeId: string;
  row: string;
  number: number;
  type: "regular" | "vip" | "couple";
  status: "available" | "locked" | "sold";
  price: number;
};

export type BookingHold = {
  id: string;
  showtimeId: string;
  seats: string[]; 
  expiresAt: string;
};

export type Booking = {
  _id?: string;
  id?: string;
  userId: string;
  showtimeId: string;
  seats: string[];
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  bookingCode?: string;
  paymentId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Ticket = {
  id: string;
  bookingId: string;
  userId: string;
  movieTitle: string;
  theaterName: string;
  showtime: string;
  seats: string[];
  qrCode: string;
  status: "active" | "used" | "expired";
};

export type Payment = {
  _id?: string;
  id?: string;
  bookingId: string;
  amount: number;
  method: "momo" | "vnpay" | "zalopay" | "credit_card" | "debit_card" | "paypal" | "cash";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  paidAt?: string;
  createdAt?: string;
};
