import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const HOTEL_IMAGES = [
  'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg',
  'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
  'https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg',
  'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
  'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
];

const ROOM_IMAGES = [
  'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg',
  'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
  'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg',
  'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
];

const AMENITIES = [
  'WiFi',
  'Pool',
  'Gym',
  'Spa',
  'Restaurant',
  'Bar',
  'Parking',
  'Room Service',
  'Air Conditioning',
  'Pet Friendly',
  'Airport Shuttle',
  'Business Center',
];

const HOTELS = [
  {
    name: 'Grand Plaza Hotel',
    city: 'New York',
    address: '123 Broadway St, Manhattan, NY 10001',
    description: 'Luxurious hotel in the heart of Manhattan with stunning city views and world-class amenities.',
    rating: 4.5,
    latitude: 40.7489,
    longitude: -73.9680,
  },
  {
    name: 'Oceanview Resort',
    city: 'Miami',
    address: '456 Beach Blvd, Miami Beach, FL 33139',
    description: 'Beautiful beachfront resort offering direct ocean access and tropical paradise experience.',
    rating: 4.8,
    latitude: 25.7907,
    longitude: -80.1300,
  },
  {
    name: 'Mountain Lodge',
    city: 'Denver',
    address: '789 Summit Ave, Denver, CO 80202',
    description: 'Cozy mountain retreat with breathtaking views of the Rocky Mountains.',
    rating: 4.3,
    latitude: 39.7392,
    longitude: -104.9903,
  },
  {
    name: 'Downtown Business Hotel',
    city: 'Chicago',
    address: '321 Michigan Ave, Chicago, IL 60601',
    description: 'Modern business hotel in downtown Chicago, perfect for corporate travelers.',
    rating: 4.2,
    latitude: 41.8781,
    longitude: -87.6298,
  },
  {
    name: 'Hollywood Luxury Suites',
    city: 'Los Angeles',
    address: '555 Sunset Blvd, Los Angeles, CA 90028',
    description: 'Glamorous hotel on the famous Sunset Boulevard with celebrity-style amenities.',
    rating: 4.6,
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    name: 'Historic Inn',
    city: 'Boston',
    address: '234 Beacon St, Boston, MA 02116',
    description: 'Charming historic inn in Boston with colonial-era architecture and modern comforts.',
    rating: 4.4,
    latitude: 42.3601,
    longitude: -71.0589,
  },
  {
    name: 'Tech Valley Hotel',
    city: 'San Francisco',
    address: '876 Market St, San Francisco, CA 94102',
    description: 'Contemporary hotel in the heart of San Francisco with cutting-edge technology.',
    rating: 4.5,
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    name: 'Music City Inn',
    city: 'Nashville',
    address: '432 Broadway, Nashville, TN 37203',
    description: 'Vibrant hotel on Nashville\'s famous Broadway with live music and southern hospitality.',
    rating: 4.3,
    latitude: 36.1627,
    longitude: -86.7816,
  },
  {
    name: 'Desert Oasis Resort',
    city: 'Phoenix',
    address: '999 Desert Ridge, Phoenix, AZ 85050',
    description: 'Luxurious desert resort with golf courses and world-class spa facilities.',
    rating: 4.7,
    latitude: 33.4484,
    longitude: -112.0740,
  },
  {
    name: 'Waterfront Hotel',
    city: 'Seattle',
    address: '111 Pike St, Seattle, WA 98101',
    description: 'Modern waterfront hotel with stunning views of Puget Sound and easy access to downtown.',
    rating: 4.6,
    latitude: 47.6062,
    longitude: -122.3321,
  },
];

const ROOM_TYPES = [
  {
    name: 'Standard Room',
    roomType: 'Standard',
    capacity: 2,
    pricePerNight: 120,
    totalRooms: 20,
    description: 'Comfortable standard room with queen bed and modern amenities.',
  },
  {
    name: 'Deluxe Room',
    roomType: 'Deluxe',
    capacity: 2,
    pricePerNight: 180,
    totalRooms: 15,
    description: 'Spacious deluxe room with king bed and premium furnishings.',
  },
  {
    name: 'Family Suite',
    roomType: 'Suite',
    capacity: 4,
    pricePerNight: 280,
    totalRooms: 10,
    description: 'Large family suite with separate bedroom and living area.',
  },
  {
    name: 'Executive Suite',
    roomType: 'Suite',
    capacity: 2,
    pricePerNight: 350,
    totalRooms: 5,
    description: 'Luxury executive suite with stunning views and premium amenities.',
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  console.log('Creating users...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hotel.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@hotel.com',
      passwordHash: adminPassword,
      phone: '+1234567890',
      role: 'ADMIN',
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: userPassword,
      phone: '+1234567891',
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      passwordHash: userPassword,
      phone: '+1234567892',
      role: 'USER',
    },
  });

  console.log('Creating amenities...');
  const amenities = await Promise.all(
    AMENITIES.map((name) =>
      prisma.amenity.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  console.log('Creating hotels with rooms...');
  for (let i = 0; i < HOTELS.length; i++) {
    const hotelData = HOTELS[i];
    const mainImage = HOTEL_IMAGES[i % HOTEL_IMAGES.length];

    const hotel = await prisma.hotel.create({
      data: {
        ...hotelData,
        mainImage,
        images: {
          create: [
            { imageUrl: HOTEL_IMAGES[(i + 1) % HOTEL_IMAGES.length] },
            { imageUrl: HOTEL_IMAGES[(i + 2) % HOTEL_IMAGES.length] },
            { imageUrl: HOTEL_IMAGES[(i + 3) % HOTEL_IMAGES.length] },
          ],
        },
        amenities: {
          create: amenities.slice(0, 6 + (i % 4)).map((amenity) => ({
            amenityId: amenity.id,
          })),
        },
      },
    });

    for (const roomType of ROOM_TYPES) {
      await prisma.room.create({
        data: {
          ...roomType,
          hotelId: hotel.id,
          pricePerNight: roomType.pricePerNight + (i * 10),
          images: {
            create: [
              { imageUrl: ROOM_IMAGES[0] },
              { imageUrl: ROOM_IMAGES[1] },
            ],
          },
        },
      });
    }

    console.log(`✅ Created hotel: ${hotelData.name}`);
  }

  console.log('Creating sample bookings...');
  const hotels = await prisma.hotel.findMany({ include: { rooms: true } });

  const now = new Date();
  const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const pastDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

  if (hotels[0] && hotels[0].rooms[0]) {
    await prisma.booking.create({
      data: {
        userId: user1.id,
        hotelId: hotels[0].id,
        roomId: hotels[0].rooms[0].id,
        checkIn: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        checkOut: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
        guests: 2,
        roomsCount: 1,
        totalAmount: hotels[0].rooms[0].pricePerNight * 3,
        status: 'CONFIRMED',
        paymentStatus: 'COMPLETED',
      },
    });
  }

  if (hotels[1] && hotels[1].rooms[1]) {
    await prisma.booking.create({
      data: {
        userId: user2.id,
        hotelId: hotels[1].id,
        roomId: hotels[1].rooms[1].id,
        checkIn: pastDate,
        checkOut: new Date(pastDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        guests: 2,
        roomsCount: 1,
        totalAmount: hotels[1].rooms[1].pricePerNight * 2,
        status: 'COMPLETED',
        paymentStatus: 'COMPLETED',
      },
    });

    await prisma.review.create({
      data: {
        userId: user2.id,
        hotelId: hotels[1].id,
        rating: 5,
        comment: 'Amazing stay! The oceanview was spectacular and the staff was incredibly friendly.',
      },
    });
  }

  console.log('✨ Seed completed successfully!');
  console.log('\n📧 Test Accounts:');
  console.log('Admin: admin@hotel.com / admin123');
  console.log('User: john@example.com / user123');
  console.log('User: jane@example.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
