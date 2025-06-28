import db from '@/db';
import { courses } from '@/types';
import { NextRequest, NextResponse } from 'next/server';
import { FormState } from '@/store';
import { sendCounsellingConfirmation } from '@/mail';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { seedVideos } from '../../../../prisma/seedVideos';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { form_values, course_name, amount_to_pay } = (await request.json()) as {
    form_values: FormState;
    course_name: courses;
    amount_to_pay: number;
  };

  const { name, age, whatsapp, email } = form_values;

  try {
    // Get the user from database to ensure we have the correct ID
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    switch (course_name) {
      case courses['seven-day-program']:
        // Create course for user
        const course = await db.course.create({
          data: {
            name: "7 Days Program",
            userId: user.id,
            from: new Date(),
            to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            by: ["Ms. Sonali Khade"],
          }
        });

        // Create videos using seed data
        for (const videoData of seedVideos) {
          await db.video.create({
            data: {
              title: videoData.title,
              description: videoData.description,
              vimeoId: videoData.vimeoId,
              dayNumber: videoData.dayNumber,
              courseId: course.id,
            }
          });
        }

        const newPurchase = await db.sevenDaysProgramUser.create({
          data: {
            name,
            email,
            whatsapp: +whatsapp,
            age: +age,
            amountPaid: 1499,
          },
        });

        return NextResponse.json({
          message: `Registration successful`,
          id: newPurchase.id,
          courseId: course.id,
        });

      case courses['personal-couselling']:
        const new_purchase = await db.personalCounsellingUser.create({
          data: {
            name,
            email,
            whatsapp: +whatsapp,
            age: +age,
            amountPaid: amount_to_pay,
          },
        });

        // Send confirmation emails
        await sendCounsellingConfirmation({
          name,
          email,
          whatsapp,
          age,
          amountPaid: amount_to_pay
        });

        return NextResponse.json({
          message: `Registration successful`,
          id: new_purchase.id,
        });

      default:
        return NextResponse.json({
          message: 'Invalid course type',
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json({
      message: 'Registration failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}