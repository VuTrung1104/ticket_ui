# WebĐặtVé - Cinema Booking Platform

> Hệ thống đặt vé xem phim trực tuyến với Next.js 15, TypeScript và Tailwind CSS

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

## Tính năng chính

- **Đặt vé realtime**: Chọn ghế với Socket.IO, cập nhật trạng thái tức thì
- **Thanh toán đa dạng**: VNPay, MoMo, ZaloPay
- **Xác thực OAuth**: Google, Facebook
- **Quản trị viên**: Dashboard, quản lý phim/suất chiếu/rạp/người dùng/đặt vé
- **Responsive**: Tối ưu cho mọi thiết bị

## Tech Stack

- **Next.js 15** - App Router, Turbopack, RSC
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **Socket.IO** - Realtime updates
- **Axios** - API client
- **Recharts** - Data visualization

## Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd webdatve

# Cài đặt dependencies
npm install

# Tạo file .env.local
cp .env.example .env.local

# Chạy development server
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
```

## Scripts

```bash
npm run dev          # Development server
npm run build        # Build production
npm start            # Run production
npm run lint         # ESLint check
npm run type-check   # TypeScript check
```

## Cấu trúc

```
webdatve/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth routes
│   │   │   ├── callback/             # OAuth callback
│   │   │   ├── login/                # Login page
│   │   │   └── register/             # Register page
│   │   ├── (main)/                   # Main application routes
│   │   │   ├── movies/               # Movies listing & detail
│   │   │   ├── showtimes/            # Showtimes & seat selection
│   │   │   ├── theaters/             # Theater information
│   │   │   ├── checkout/             # Booking checkout
│   │   │   ├── profile/              # User profile
│   │   │   ├── wishlist/             # Favorite movies
│   │   │   ├── booking-success/      # Booking success page
│   │   │   ├── payment-success/      # Payment success page
│   │   │   ├── payment-failed/       # Payment failed page
│   │   │   ├── gioi-thieu/           # About page
│   │   │   └── lien-he/              # Contact page
│   │   ├── admin/                    # Admin dashboard
│   │   │   ├── layout.tsx            # Admin layout
│   │   │   ├── dashboard/            # Overview & statistics
│   │   │   ├── movies/               # Movie management
│   │   │   ├── showtimes/            # Showtime management
│   │   │   ├── bookings/             # Booking management
│   │   │   ├── theaters/             # Theater management
│   │   │   ├── users/                # User management
│   │   │   └── settings/             # System settings
│   │   ├── providers/                # Context providers
│   │   │   └── AuthProvider.tsx      # Auth context
│   │   ├── AppWrapper.tsx            # App wrapper
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   └── not-found.tsx             # 404 page
│   ├── components/                   # React components
│   │   ├── auth/                     # Authentication UI
│   │   │   ├── AuthButton.tsx
│   │   │   ├── AuthInput.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── ErrorAlert.tsx
│   │   │   └── SocialLoginButtons.tsx
│   │   ├── booking/                  # Booking flow UI
│   │   │   └── Slider.tsx
│   │   ├── layout/                   # Header, Footer, etc.
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MovieCard.tsx
│   │   │   ├── MovieGrid.tsx
│   │   │   └── PosterWithHover.tsx
│   │   ├── ui/                       # Reusable UI components
│   │   │   └── ScrollToTop.tsx
│   │   └── upload/                   # Image upload components
│   │       ├── ImageUpload.tsx
│   │       └── MultipleImageUpload.tsx
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts                # Authentication hook
│   │   ├── useBooking.ts             # Booking state hook
│   │   ├── useSeatRealtime.ts        # Realtime seat updates
│   │   └── useScroll.ts              # Scroll detection
│   ├── lib/                          # Services & utilities
│   │   ├── apiClient.ts              # Axios configuration
│   │   ├── authService.ts            # Auth API calls
│   │   ├── bookingService.ts         # Booking API calls
│   │   ├── movieService.ts           # Movie API calls
│   │   ├── showtimeService.ts        # Showtime API calls
│   │   ├── paymentService.ts         # Payment API calls
│   │   ├── userService.ts            # User API calls
│   │   ├── uploadService.ts          # File upload
│   │   ├── utils.ts                  # Utility functions
│   │   └── index.ts                  # Export all services
│   ├── types/                        # TypeScript definitions
│   │   └── index.ts                  # Shared types
│   ├── utils/                        # Utility functions
│   │   └── validation.ts             # Form validators
│   └── constants/                    # App constants
│       └── auth.ts                   # Auth constants
├── public/
│   └── assets/                       # Static files
│       ├── icons/
│       ├── images/
│       ├── posters/
│       └── hover/
├── .env.local                        # Environment variables
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── postcss.config.mjs                # PostCSS configuration
├── eslint.config.mjs                 # ESLint configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies
└── README.md                         # Documentation
```

## Routes chính

| Route | Mô tả |
|-------|-------|
| `/` | Trang chủ |
| `/movies` | Danh sách phim |
| `/movies/[slug]` | Chi tiết phim |
| `/showtimes/[id]` | Chọn ghế & đặt vé |
| `/theaters` | Danh sách rạp |
| `/profile` | Thông tin cá nhân |
| `/admin/*` | Quản trị |

## Deployment

### Vercel (Khuyến nghị)

```bash
# Deploy tự động từ GitHub
vercel --prod
```

### Manual

```bash
npm run build
npm start

## License

© 2026 WebĐặtVé - All rights reserved

