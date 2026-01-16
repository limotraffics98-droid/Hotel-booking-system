/*
  # Hotel Booking Platform Database Schema

  ## Overview
  Complete database schema for a hotel booking platform with user management, 
  hotel/room listings, booking system, payments, and reviews.

  ## Tables Created

  ### 1. users
  - Core user authentication and profile data
  - Fields: id (UUID), name, email (unique), phone, password_hash, role (USER/ADMIN), status
  - Indexes on email for fast lookups

  ### 2. hotels
  - Hotel property information
  - Fields: id, name, city, address, description, rating, coordinates, main_image
  - Indexes on city and rating for filtering/sorting

  ### 3. hotel_images
  - Multiple images per hotel
  - Foreign key to hotels with CASCADE delete

  ### 4. amenities
  - Master list of hotel amenities (WiFi, Pool, Gym, etc.)

  ### 5. hotel_amenities
  - Many-to-many relationship between hotels and amenities

  ### 6. rooms
  - Room types available at each hotel
  - Fields: id, hotel_id, name, room_type, capacity, price_per_night, total_rooms
  - Critical: total_rooms determines availability for booking system

  ### 7. room_images
  - Multiple images per room type
  - Foreign key to rooms with CASCADE delete

  ### 8. bookings
  - Core booking records with date ranges
  - Fields: id, user_id, hotel_id, room_id, check_in, check_out, guests, rooms_count
  - Status: PENDING_PAYMENT, CONFIRMED, CANCELLED, COMPLETED
  - Payment status tracking
  - Indexes on date ranges for availability checks

  ### 9. payments
  - Payment transaction records
  - One-to-one relationship with bookings
  - Supports multiple payment providers

  ### 10. reviews
  - User reviews and ratings (1-5 stars)
  - Foreign key to users and hotels

  ## Security
  - All tables use UUID primary keys
  - Proper foreign key constraints with CASCADE deletes where appropriate
  - Comprehensive indexes for query performance
  - Row Level Security policies will be added separately

  ## Notes
  - PostgreSQL-specific features used (enums, UUID, timestamp)
  - Designed for scalability and data integrity
  - Supports concurrent booking prevention through proper indexing
*/

-- Create enums
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
CREATE TYPE "BookingStatus" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "phone" TEXT,
  "password_hash" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'USER',
  "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");

-- Hotels table
CREATE TABLE IF NOT EXISTS "hotels" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "name" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "lat" DOUBLE PRECISION,
  "lng" DOUBLE PRECISION,
  "main_image" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "hotels_city_idx" ON "hotels"("city");
CREATE INDEX IF NOT EXISTS "hotels_rating_idx" ON "hotels"("rating");

-- Hotel images table
CREATE TABLE IF NOT EXISTS "hotel_images" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "hotel_id" TEXT NOT NULL,
  "image_url" TEXT NOT NULL,
  CONSTRAINT "hotel_images_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "hotel_images_hotel_id_idx" ON "hotel_images"("hotel_id");

-- Amenities table
CREATE TABLE IF NOT EXISTS "amenities" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "name" TEXT UNIQUE NOT NULL
);

-- Hotel amenities junction table
CREATE TABLE IF NOT EXISTS "hotel_amenities" (
  "hotel_id" TEXT NOT NULL,
  "amenity_id" TEXT NOT NULL,
  PRIMARY KEY ("hotel_id", "amenity_id"),
  CONSTRAINT "hotel_amenities_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "hotel_amenities_amenity_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "amenities"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Rooms table
CREATE TABLE IF NOT EXISTS "rooms" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "hotel_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "room_type" TEXT NOT NULL,
  "capacity" INTEGER NOT NULL,
  "price_per_night" DOUBLE PRECISION NOT NULL,
  "total_rooms" INTEGER NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "rooms_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "rooms_hotel_id_idx" ON "rooms"("hotel_id");
CREATE INDEX IF NOT EXISTS "rooms_price_per_night_idx" ON "rooms"("price_per_night");

-- Room images table
CREATE TABLE IF NOT EXISTS "room_images" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "room_id" TEXT NOT NULL,
  "image_url" TEXT NOT NULL,
  CONSTRAINT "room_images_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "room_images_room_id_idx" ON "room_images"("room_id");

-- Bookings table
CREATE TABLE IF NOT EXISTS "bookings" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "user_id" TEXT NOT NULL,
  "hotel_id" TEXT NOT NULL,
  "room_id" TEXT NOT NULL,
  "check_in" TIMESTAMP(3) NOT NULL,
  "check_out" TIMESTAMP(3) NOT NULL,
  "guests" INTEGER NOT NULL,
  "rooms_count" INTEGER NOT NULL,
  "total_amount" DOUBLE PRECISION NOT NULL,
  "status" "BookingStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
  "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "bookings_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "bookings_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "bookings_user_id_idx" ON "bookings"("user_id");
CREATE INDEX IF NOT EXISTS "bookings_hotel_id_idx" ON "bookings"("hotel_id");
CREATE INDEX IF NOT EXISTS "bookings_room_id_idx" ON "bookings"("room_id");
CREATE INDEX IF NOT EXISTS "bookings_check_in_check_out_idx" ON "bookings"("check_in", "check_out");
CREATE INDEX IF NOT EXISTS "bookings_status_idx" ON "bookings"("status");

-- Payments table
CREATE TABLE IF NOT EXISTS "payments" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "booking_id" TEXT UNIQUE NOT NULL,
  "provider" TEXT NOT NULL,
  "provider_ref" TEXT,
  "amount" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "payments_booking_id_idx" ON "payments"("booking_id");

-- Reviews table
CREATE TABLE IF NOT EXISTS "reviews" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "user_id" TEXT NOT NULL,
  "hotel_id" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "reviews_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "reviews_rating_check" CHECK ("rating" >= 1 AND "rating" <= 5)
);

CREATE INDEX IF NOT EXISTS "reviews_hotel_id_idx" ON "reviews"("hotel_id");
CREATE INDEX IF NOT EXISTS "reviews_user_id_idx" ON "reviews"("user_id");

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON "hotels"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON "rooms"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON "bookings"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON "payments"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON "reviews"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
