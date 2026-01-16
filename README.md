# Hotel Booking Application

A complete, production-ready hotel booking platform built with React, Express, TypeScript, and Supabase (PostgreSQL).

## Features

### User Features
- Browse and search hotels by city, price, rating, and amenities
- View detailed hotel information with images and amenities
- Real-time room availability checking
- Secure booking process with instant confirmation
- User profile management
- Booking history (upcoming, past, cancelled)
- Booking cancellation
- User authentication (JWT-based)

### Admin Features
- Dashboard with statistics (hotels, bookings, revenue, users)
- View all bookings and manage their status
- Recent bookings overview

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router v6
- Tailwind CSS
- Lucide React (icons)

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- JWT Authentication
- bcrypt for password hashing
- Zod for validation

### Database
- Supabase (PostgreSQL)
- Prisma for migrations and queries

## Project Structure

```
hotel-booking-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── utils/
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── src/
│   ├── api/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (database is already provisioned)

### Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Set up environment variables:

**Frontend (.env):**
```
VITE_API_BASE_URL=http://localhost:3001/api
```

**Backend (backend/.env):**
```
DATABASE_URL=your_supabase_connection_string
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. Generate Prisma client:
```bash
cd backend
npx prisma generate
```

5. Run database migrations (already done via Supabase MCP)

6. Seed the database:
```bash
cd backend
npm run prisma:seed
```

### Running the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

#### Production Mode with Docker

```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

## Test Accounts

After seeding the database, you can use these accounts:

### Admin Account
- Email: `admin@hotel.com`
- Password: `admin123`

### User Accounts
- Email: `john@example.com` / Password: `user123`
- Email: `jane@example.com` / Password: `user123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Update password

### Hotels
- `GET /api/hotels` - Search hotels (with filters)
- `GET /api/hotels/:id` - Get hotel details
- `GET /api/hotels/:id/availability` - Check room availability
- `GET /api/hotels/:id/rooms` - Get hotel rooms

### Bookings
- `POST /api/bookings` - Create booking (requires auth)
- `GET /api/bookings/my` - Get user's bookings (requires auth)
- `GET /api/bookings/:id` - Get booking details (requires auth)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (requires auth)

### Reviews
- `POST /api/hotels/:id/reviews` - Create review (requires auth)
- `GET /api/hotels/:id/reviews` - Get hotel reviews

### Admin
- `GET /api/admin/stats` - Get dashboard statistics (requires admin)
- `POST /api/admin/hotels` - Create hotel (requires admin)
- `PUT /api/admin/hotels/:id` - Update hotel (requires admin)
- `DELETE /api/admin/hotels/:id` - Delete hotel (requires admin)
- `POST /api/admin/hotels/:id/rooms` - Create room (requires admin)
- `PUT /api/admin/rooms/:roomId` - Update room (requires admin)
- `DELETE /api/admin/rooms/:roomId` - Delete room (requires admin)
- `GET /api/admin/bookings` - Get all bookings (requires admin)
- `PATCH /api/admin/bookings/:id/status` - Update booking status (requires admin)

## Database Schema

### Main Tables
- **users** - User accounts with role-based access
- **hotels** - Hotel properties with location and details
- **hotel_images** - Multiple images per hotel
- **amenities** - Master list of amenities
- **hotel_amenities** - Many-to-many hotel-amenity relationship
- **rooms** - Room types with pricing and availability
- **room_images** - Room photos
- **bookings** - Reservation records with date ranges
- **payments** - Payment transactions
- **reviews** - User reviews and ratings

## Availability Logic

The system implements accurate room availability:
- Each room type has a `total_rooms` count
- For any date range, the system counts overlapping bookings where status is `CONFIRMED` or `PENDING_PAYMENT`
- Available rooms = total_rooms - booked_rooms
- Prevents overbooking through database-level checks

## Security Features

- JWT-based authentication with access and refresh tokens
- bcrypt password hashing
- Rate limiting on auth endpoints
- Role-based access control (USER/ADMIN)
- Input validation with Zod
- Secure HTTP headers (Helmet)
- CORS configuration

## Production Deployment

### Backend
1. Set production environment variables
2. Build: `npm run build`
3. Start: `npm start`

### Frontend
1. Update `.env` with production API URL
2. Build: `npm run build`
3. Serve `dist/` folder with Nginx or similar

### Docker Deployment
```bash
docker-compose up -d
```

## Development Scripts

### Frontend
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

### Backend
- `npm run dev` - Start dev server with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:seed` - Seed database
- `npm run prisma:studio` - Open Prisma Studio

## Future Enhancements

- Payment gateway integration (Stripe)
- Email notifications
- Reviews and ratings system (partially implemented)
- Advanced search filters
- Hotel favorites/wishlist
- Multi-language support
- Mobile app

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
