# Hotel Booking Application - Complete Project Structure

## Directory Tree

```
hotel-booking-app/
├── frontend/                        # React Frontend Application
│   ├── src/
│   │   ├── api/                    # API Client & Services
│   │   │   ├── client.ts           # Axios/Fetch client wrapper
│   │   │   ├── auth.ts             # Authentication API calls
│   │   │   ├── hotels.ts           # Hotel search & details API
│   │   │   └── bookings.ts         # Booking management API
│   │   │
│   │   ├── components/             # Reusable Components
│   │   │   ├── common/             # Generic components
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   └── layout/             # Layout components
│   │   │       └── Navbar.tsx      # Navigation bar
│   │   │
│   │   ├── contexts/               # React Context Providers
│   │   │   └── AuthContext.tsx     # Authentication state management
│   │   │
│   │   ├── pages/                  # Page Components (Routes)
│   │   │   ├── Home.tsx            # Landing page with search
│   │   │   ├── SearchHotels.tsx    # Hotel listing with filters
│   │   │   ├── Profile.tsx         # User profile management
│   │   │   ├── auth/               # Authentication pages
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── hotel/              # Hotel-related pages
│   │   │   │   └── HotelDetails.tsx # Detailed hotel view
│   │   │   ├── booking/            # Booking workflow pages
│   │   │   │   ├── Checkout.tsx    # Booking form & payment
│   │   │   │   ├── MyBookings.tsx  # User booking history
│   │   │   │   └── BookingConfirmation.tsx # Confirmation page
│   │   │   └── admin/              # Admin pages
│   │   │       └── AdminDashboard.tsx # Admin stats & management
│   │   │
│   │   ├── types/                  # TypeScript type definitions
│   │   │   └── index.ts            # Shared interfaces & types
│   │   │
│   │   ├── App.tsx                 # Main app component with routing
│   │   ├── main.tsx                # React entry point
│   │   └── index.css               # Tailwind CSS imports
│   │
│   ├── public/                     # Static assets
│   ├── index.html                  # HTML template
│   ├── package.json                # Frontend dependencies
│   ├── tsconfig.json               # TypeScript config
│   ├── tailwind.config.js          # Tailwind CSS config
│   ├── vite.config.ts              # Vite build config
│   ├── Dockerfile                  # Frontend container
│   ├── nginx.conf                  # Nginx config for production
│   └── .env                        # Environment variables
│
├── backend/                        # Express Backend API
│   ├── src/
│   │   ├── controllers/            # Request handlers
│   │   │   ├── authController.ts   # Auth endpoints (register, login, etc.)
│   │   │   ├── hotelController.ts  # Hotel search & details
│   │   │   ├── bookingController.ts # Booking management
│   │   │   ├── reviewController.ts # Reviews & ratings
│   │   │   └── adminController.ts  # Admin operations
│   │   │
│   │   ├── middleware/             # Express middleware
│   │   │   ├── auth.ts             # JWT authentication & authorization
│   │   │   ├── errorHandler.ts     # Global error handling
│   │   │   └── validateRequest.ts  # Input validation middleware
│   │   │
│   │   ├── routes/                 # API route definitions
│   │   │   ├── authRoutes.ts       # /api/auth/* routes
│   │   │   ├── hotelRoutes.ts      # /api/hotels/* routes
│   │   │   ├── bookingRoutes.ts    # /api/bookings/* routes
│   │   │   ├── reviewRoutes.ts     # /api/hotels/:id/reviews routes
│   │   │   └── adminRoutes.ts      # /api/admin/* routes
│   │   │
│   │   ├── utils/                  # Utility functions
│   │   │   ├── auth.ts             # JWT & bcrypt utilities
│   │   │   ├── response.ts         # Standardized API responses
│   │   │   ├── validation.ts       # Zod validation schemas
│   │   │   ├── pagination.ts       # Pagination helpers
│   │   │   └── prisma.ts           # Prisma client instance
│   │   │
│   │   ├── types/                  # TypeScript types
│   │   │   └── index.ts            # Request/Response interfaces
│   │   │
│   │   └── server.ts               # Express app entry point
│   │
│   ├── prisma/                     # Database schema & migrations
│   │   ├── schema.prisma           # Prisma schema definition
│   │   └── seed.ts                 # Database seeding script
│   │
│   ├── package.json                # Backend dependencies
│   ├── tsconfig.json               # TypeScript config
│   ├── Dockerfile                  # Backend container
│   └── .env                        # Backend environment variables
│
├── docker-compose.yml              # Multi-container orchestration
├── README.md                       # Setup & usage documentation
└── PROJECT_STRUCTURE.md            # This file

```

## Key Features by Layer

### Frontend (React + TypeScript + Vite)

#### Authentication
- JWT-based authentication with access/refresh tokens
- Login & registration pages
- Protected routes with role-based access control
- Persistent authentication state

#### User Features
- **Home Page**: Hero section with hotel search form
- **Search Results**: Filterable hotel listing (price, rating, amenities)
- **Hotel Details**: Gallery, amenities, room selection, availability checker
- **Checkout**: Guest info, booking summary, confirmation
- **My Bookings**: View upcoming/past/cancelled bookings
- **Profile**: Edit personal info & change password

#### Admin Features
- Dashboard with statistics (hotels, bookings, revenue, users)
- Recent bookings overview

### Backend (Express + TypeScript + Prisma)

#### API Endpoints

**Authentication** (`/api/auth`)
- POST `/register` - Create new user account
- POST `/login` - Authenticate & get tokens
- POST `/refresh` - Refresh access token
- GET `/me` - Get current user profile
- PUT `/profile` - Update user profile
- PUT `/password` - Change password

**Hotels** (`/api/hotels`)
- GET `/` - Search hotels with filters
- GET `/:id` - Get hotel details
- GET `/:id/availability` - Check room availability
- GET `/:id/rooms` - List hotel rooms

**Bookings** (`/api/bookings`)
- POST `/` - Create booking (requires auth)
- GET `/my` - Get user's bookings (requires auth)
- GET `/:id` - Get booking details (requires auth)
- PATCH `/:id/cancel` - Cancel booking (requires auth)

**Reviews** (`/api/hotels/:id/reviews`)
- POST `/` - Create review (requires auth)
- GET `/` - Get hotel reviews

**Admin** (`/api/admin`)
- GET `/stats` - Dashboard statistics
- POST `/hotels` - Create hotel
- PUT `/hotels/:id` - Update hotel
- DELETE `/hotels/:id` - Delete hotel
- POST `/hotels/:id/rooms` - Create room
- PUT `/rooms/:roomId` - Update room
- DELETE `/rooms/:roomId` - Delete room
- GET `/bookings` - List all bookings
- PATCH `/bookings/:id/status` - Update booking status

#### Security Features
- JWT access (15min) & refresh tokens (7 days)
- bcrypt password hashing (10 rounds)
- Rate limiting on auth endpoints (10 requests/15min)
- Helmet.js for secure HTTP headers
- CORS configuration
- Zod input validation
- Role-based authorization (USER/ADMIN)

### Database (Supabase PostgreSQL + Prisma ORM)

#### Tables

**users**
- id (UUID, PK)
- name, email (unique), phone
- passwordHash
- role (USER/ADMIN), status (ACTIVE/INACTIVE/SUSPENDED)
- timestamps

**hotels**
- id (UUID, PK)
- name, city, address, description
- rating (calculated from reviews)
- latitude, longitude (for maps)
- mainImage
- timestamps

**hotel_images**
- id (UUID, PK)
- hotelId (FK -> hotels)
- imageUrl

**amenities**
- id (UUID, PK)
- name (unique) - e.g., WiFi, Pool, Gym

**hotel_amenities**
- hotelId (FK -> hotels)
- amenityId (FK -> amenities)
- Composite PK

**rooms**
- id (UUID, PK)
- hotelId (FK -> hotels)
- name, roomType, capacity
- pricePerNight
- totalRooms (for availability calculation)
- description
- timestamps

**room_images**
- id (UUID, PK)
- roomId (FK -> rooms)
- imageUrl

**bookings**
- id (UUID, PK)
- userId (FK -> users)
- hotelId (FK -> hotels)
- roomId (FK -> rooms)
- checkIn, checkOut (date range)
- guests, roomsCount
- totalAmount
- status (PENDING_PAYMENT/CONFIRMED/CANCELLED/COMPLETED)
- paymentStatus (PENDING/COMPLETED/FAILED/REFUNDED)
- timestamps

**payments**
- id (UUID, PK)
- bookingId (FK -> bookings, unique)
- provider, providerRef
- amount, currency
- status
- timestamps

**reviews**
- id (UUID, PK)
- userId (FK -> users)
- hotelId (FK -> hotels)
- rating (1-5)
- comment
- timestamps

#### Availability Algorithm
```typescript
// For a given room and date range:
availableRooms = room.totalRooms -
  (count of overlapping bookings where status IN ['CONFIRMED', 'PENDING_PAYMENT'])

// Overlap check:
// existing.checkIn < requested.checkOut AND existing.checkOut > requested.checkIn
```

## Deployment

### Development
```bash
# Terminal 1 - Backend
cd backend
npm install
npx prisma generate
npm run dev

# Terminal 2 - Frontend
npm install
npm run dev
```

### Production (Docker)
```bash
docker-compose up --build
```

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3001/api
```

### Backend (backend/.env)
```
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_ACCESS_SECRET=secret
JWT_REFRESH_SECRET=secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
PORT=3001
NODE_ENV=production
FRONTEND_URL=http://localhost:5173
```

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| State | React Context API |
| Icons | Lucide React |
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma |
| Database | Supabase (PostgreSQL) |
| Auth | JWT + bcrypt |
| Validation | Zod |
| Security | Helmet, CORS, Rate Limiting |
| Containerization | Docker, Docker Compose |

## API Response Format

All endpoints return consistent JSON:

```typescript
{
  success: boolean,
  data?: T,
  message?: string,
  error?: string
}
```

Paginated responses include:
```typescript
{
  success: true,
  data: {
    items: T[],
    pagination: {
      total: number,
      page: number,
      limit: number,
      totalPages: number
    }
  }
}
```
