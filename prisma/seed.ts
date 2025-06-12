// prisma/seed.ts
import { PrismaClient, Category } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('Password123!', 12);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'sarah@example.com',
        username: 'sarahkim',
        firstName: 'Sarah',
        lastName: 'Kim',
        password: hashedPassword,
        verified: true,
        bio: 'Tech enthusiast and AI researcher',
        avatar: '👩‍💼'
      }
    }),
    prisma.user.create({
      data: {
        email: 'mike@example.com',
        username: 'mikejohnson',
        firstName: 'Mike',
        lastName: 'Johnson',
        password: hashedPassword,
        verified: true,
        bio: 'Startup founder and entrepreneur',
        avatar: '👨‍💼'
      }
    }),
    prisma.user.create({
      data: {
        email: 'emma@example.com',
        username: 'emmadavis',
        firstName: 'Emma',
        lastName: 'Davis',
        password: hashedPassword,
        verified: true,
        bio: 'UX Designer and creative director',
        avatar: '👩‍🎨'
      }
    }),
    prisma.user.create({
      data: {
        email: 'james@example.com',
        username: 'jameswilson',
        firstName: 'James',
        lastName: 'Wilson',
        password: hashedPassword,
        verified: true,
        bio: 'Wine enthusiast and event organizer',
        avatar: '🍷'
      }
    })
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create sample events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'AI & Machine Learning Meetup',
        description: 'Join us for an evening of discussions about the latest in AI and ML. We\'ll have presentations from industry experts and networking opportunities.',
        startDate: new Date('2025-06-20T18:00:00Z'),
        endDate: new Date('2025-06-20T21:00:00Z'),
        location: 'Tech Hub, San Francisco',
        address: '123 Tech Street, San Francisco, CA 94105',
        category: Category.TECHNOLOGY,
        maxAttendees: 200,
        price: 0,
        tags: ['AI', 'Machine Learning', 'Networking'],
        isPublic: true,
        publishedAt: new Date(),
        hostId: users[0].id,
        coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        featured: true
      }
    }),
    prisma.event.create({
      data: {
        title: 'Startup Founder Breakfast',
        description: 'Early morning networking for startup founders and entrepreneurs. Coffee, pastries, and valuable connections.',
        startDate: new Date('2025-06-22T08:00:00Z'),
        endDate: new Date('2025-06-22T10:00:00Z'),
        location: 'WeWork, Downtown',
        address: '456 Business Ave, San Francisco, CA 94107',
        category: Category.BUSINESS,
        maxAttendees: 50,
        price: 25,
        tags: ['Startup', 'Networking', 'Breakfast'],
        isPublic: true,
        publishedAt: new Date(),
        hostId: users[1].id,
        coverImage: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop'
      }
    }),
    prisma.event.create({
      data: {
        title: 'Design Workshop: UI/UX Trends 2025',
        description: 'Hands-on workshop exploring the latest design trends and tools. Perfect for designers looking to stay current.',
        startDate: new Date('2025-06-25T14:00:00Z'),
        endDate: new Date('2025-06-25T18:00:00Z'),
        location: 'Design Studio, SOMA',
        address: '789 Design Blvd, San Francisco, CA 94103',
        category: Category.DESIGN,
        maxAttendees: 100,
        price: 75,
        tags: ['Design', 'Workshop', 'UI/UX'],
        isPublic: true,
        publishedAt: new Date(),
        hostId: users[2].id,
        coverImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
        featured: true
      }
    }),
    prisma.event.create({
      data: {
        title: 'Wine Tasting & Networking',
        description: 'Elegant wine tasting event featuring local vineyards. Network with professionals while enjoying premium wines.',
        startDate: new Date('2025-06-28T19:00:00Z'),
        endDate: new Date('2025-06-28T22:00:00Z'),
        location: 'Rooftop Venue, Nob Hill',
        address: '321 Wine Street, San Francisco, CA 94108',
        category: Category.SOCIAL,
        maxAttendees: 180,
        price: 95,
        tags: ['Wine', 'Networking', 'Social'],
        isPublic: true,
        publishedAt: new Date(),
        hostId: users[3].id,
        coverImage: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&h=300&fit=crop',
        featured: false
      }
    }),
    prisma.event.create({
      data: {
        title: 'React & Next.js Workshop',
        description: 'Advanced React patterns and Next.js 14 features. Build a full-stack application from scratch.',
        startDate: new Date('2025-07-05T10:00:00Z'),
        endDate: new Date('2025-07-05T17:00:00Z'),
        location: 'Code Academy, Mission Bay',
        address: '555 Dev Street, San Francisco, CA 94158',
        category: Category.TECHNOLOGY,
        maxAttendees: 30,
        price: 150,
        tags: ['React', 'Next.js', 'JavaScript', 'Workshop'],
        isPublic: true,
        publishedAt: new Date(),
        hostId: users[0].id,
        coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop'
      }
    })
  ]);

  console.log(`✅ Created ${events.length} events`);

  // Create sample RSVPs (note: using rSVP as generated by Prisma)
  const rsvps = await Promise.all([
    prisma.rSVP.create({
      data: {
        userId: users[1].id,
        eventId: events[0].id,
        status: 'GOING'
      }
    }),
    prisma.rSVP.create({
      data: {
        userId: users[2].id,
        eventId: events[0].id,
        status: 'GOING'
      }
    }),
    prisma.rSVP.create({
      data: {
        userId: users[3].id,
        eventId: events[0].id,
        status: 'MAYBE'
      }
    }),
    prisma.rSVP.create({
      data: {
        userId: users[0].id,
        eventId: events[1].id,
        status: 'GOING'
      }
    }),
    prisma.rSVP.create({
      data: {
        userId: users[2].id,
        eventId: events[1].id,
        status: 'GOING'
      }
    }),
    prisma.rSVP.create({
      data: {
        userId: users[0].id,
        eventId: events[2].id,
        status: 'GOING'
      }
    }),
    prisma.rSVP.create({
      data: {
        userId: users[1].id,
        eventId: events[2].id,
        status: 'GOING'
      }
    }),
    prisma.rSVP.create({
      data: {
        userId: users[3].id,
        eventId: events[2].id,
        status: 'GOING'
      }
    })
  ]);

  console.log(`✅ Created ${rsvps.length} RSVPs`);

  // Create some likes
  const likes = await Promise.all([
    prisma.like.create({
      data: {
        userId: users[1].id,
        eventId: events[0].id
      }
    }),
    prisma.like.create({
      data: {
        userId: users[2].id,
        eventId: events[1].id
      }
    }),
    prisma.like.create({
      data: {
        userId: users[0].id,
        eventId: events[3].id
      }
    }),
    prisma.like.create({
      data: {
        userId: users[3].id,
        eventId: events[4].id
      }
    })
  ]);

  console.log(`✅ Created ${likes.length} likes`);

  // Update attendee counts based on actual RSVPs
  for (const event of events) {
    const goingCount = await prisma.rSVP.count({
      where: { eventId: event.id, status: 'GOING' }
    });
    
    await prisma.event.update({
      where: { id: event.id },
      data: { currentAttendees: goingCount }
    });
  }

  console.log('✅ Updated attendee counts');

  // Create some sample reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        userId: users[1].id,
        eventId: events[0].id,
        rating: 5,
        comment: 'Amazing event! Learned so much about AI trends and met great people.'
      }
    }),
    prisma.review.create({
      data: {
        userId: users[2].id,
        eventId: events[1].id,
        rating: 4,
        comment: 'Great networking opportunity. The breakfast was delicious too!'
      }
    })
  ]);

  console.log(`✅ Created ${reviews.length} reviews`);

  // Create some follow relationships
  const follows = await Promise.all([
    prisma.follow.create({
      data: {
        followerId: users[1].id,
        followingId: users[0].id
      }
    }),
    prisma.follow.create({
      data: {
        followerId: users[2].id,
        followingId: users[0].id
      }
    }),
    prisma.follow.create({
      data: {
        followerId: users[0].id,
        followingId: users[2].id
      }
    })
  ]);

  console.log(`✅ Created ${follows.length} follow relationships`);

  console.log('\n🎉 Database seeded successfully!');
  console.log(`📊 Summary:`);
  console.log(`   👥 Users: ${users.length}`);
  console.log(`   📅 Events: ${events.length}`);
  console.log(`   ✉️  RSVPs: ${rsvps.length}`);
  console.log(`   ❤️  Likes: ${likes.length}`);
  console.log(`   ⭐ Reviews: ${reviews.length}`);
  console.log(`   👫 Follows: ${follows.length}`);
  console.log('\n🚀 Ready to start the backend server!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });