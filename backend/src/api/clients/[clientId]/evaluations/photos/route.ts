// app/api/clients/[clientId]/evaluations/photos/route.ts
import { NextRequest } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getAuthSession } from '@/backend/lib/auth';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function GET(
  request: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { clientId } = params;

    const photos = await prisma.photo.findMany({
      where: {
        evaluation: {
          clientId: clientId,
        },
      },
      select: {
        url: true,
        createdAt: true,
        evaluation: {
          select: {
            dueDate: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Order by newest photos first
      },
    });

    // Format the output to include evaluation date
    const formattedPhotos = photos.map(photo => ({
      url: photo.url,
      createdAt: photo.createdAt,
      evaluationDate: photo.evaluation?.dueDate,
    }));

    return NextResponse.json(formattedPhotos);
  } catch (error) {
    console.error('Error fetching evaluation photos:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
