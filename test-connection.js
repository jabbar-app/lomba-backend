// test-connection.js
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔌 Testing database connection...');
    
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test basic operations
    const userCount = await prisma.user.count();
    const eventCount = await prisma.event.count();
    const rsvpCount = await prisma.rSVP.count();
    const likeCount = await prisma.like.count();
    
    console.log(`📊 Database stats:`);
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   📅 Events: ${eventCount}`);
    console.log(`   ✉️  RSVPs: ${rsvpCount}`);
    console.log(`   ❤️  Likes: ${likeCount}`);
    
    // Get a sample event with details
    const sampleEvent = await prisma.event.findFirst({
      include: {
        host: { select: { firstName: true, lastName: true } },
        _count: { select: { rsvps: true, likes: true } }
      }
    });
    
    if (sampleEvent) {
      console.log(`\n🎯 Sample event:`);
      console.log(`   Title: ${sampleEvent.title}`);
      console.log(`   Host: ${sampleEvent.host.firstName} ${sampleEvent.host.lastName}`);
      console.log(`   RSVPs: ${sampleEvent._count.rsvps}`);
      console.log(`   Likes: ${sampleEvent._count.likes}`);
    }
    
    console.log('\n🎉 Database is ready to use!');
    console.log('🚀 You can now start the backend server with: npm run dev');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    
    if (error.code === 'P1001') {
      console.log('\n💡 Make sure your database is running:');
      console.log('   docker-compose up db redis -d');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();