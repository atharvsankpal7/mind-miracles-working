import { PrismaClient } from '@prisma/client';
import { seedVideos } from './seedVideos';

const prisma = new PrismaClient();

async function seedPaidUser() {
  try {
    console.log('🌱 Starting to seed paid user...');

    // Create a test user
    const user = await prisma.user.upsert({
      where: { email: 'testuser@example.com' },
      update: {},
      create: {
        name: 'Test User',
        email: 'testuser@example.com',
        image: 'https://via.placeholder.com/150',
        token: 'test-token-123',
      },
    });

    console.log('✅ Created/found user:', user.email);

    // Create a course for the user (7 Days Program)
    const course = await prisma.course.upsert({
      where: { id: 'test-course-id' },
      update: {},
      create: {
        id: 'test-course-id',
        name: '7 Days Program',
        userId: user.id,
        from: new Date(), // Course starts today
        to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Ends in 7 days
        by: ['Ms. Sonali Khade'],
      },
    });

    console.log('✅ Created/found course:', course.name);

    // Create videos for the course using seed data
    for (const videoData of seedVideos) {
      const video = await prisma.video.upsert({
        where: { vimeoId: videoData.vimeoId },
        update: {},
        create: {
          title: videoData.title,
          description: videoData.description,
          vimeoId: videoData.vimeoId,
          dayNumber: videoData.dayNumber,
          courseId: course.id,
        },
      });

      console.log(`✅ Created/found video: Day ${video.dayNumber} - ${video.title}`);

      // Add some sample progress for the first few videos
      if (videoData.dayNumber <= 3) {
        await prisma.videoProgress.upsert({
          where: {
            userId_videoId: {
              userId: user.id,
              videoId: video.id,
            },
          },
          update: {},
          create: {
            userId: user.id,
            videoId: video.id,
            progress: videoData.dayNumber === 1 ? 100 : videoData.dayNumber === 2 ? 75 : 25,
            completed: videoData.dayNumber === 1,
            lastWatched: new Date(),
          },
        });

        console.log(`✅ Added progress for video: Day ${videoData.dayNumber}`);
      }
    }

    // Create a record in SevenDaysProgramUser to show payment
    await prisma.sevenDaysProgramUser.upsert({
      where: { id: `test-program-${user.email}` },
      update: {},
      create: {
        id: `test-program-${user.email}`,
        name: user.name,
        email: user.email,
        whatsapp: 1234567890,
        age: 25,
        amountPaid: 1499,
        date: new Date(),
      },
    });

    console.log('✅ Created payment record for 7 Days Program');

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\nTest User Details:');
    console.log('Email: testuser@example.com');
    console.log('Course: 7 Days Program');
    console.log('Videos: 7 videos created');
    console.log('Progress: Day 1 completed, Day 2 75% watched, Day 3 25% watched');
    console.log('\nYou can now sign in with this email to test the course functionality.');

  } catch (error) {
    console.error('❌ Error seeding paid user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
// Run the seed function
if (require.main === module) {
  seedPaidUser()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedPaidUser };