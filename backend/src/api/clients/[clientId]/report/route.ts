import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { renderToStaticMarkup } from 'react-dom/server';
import { ClientReport } from '@/frontend/app/components/reports/ClientReport';
import pdf from 'html-pdf-node';
import { getAuthSession } from '@/backend/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const session = await getAuthSession();
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { clientId } = params;

  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        anamnesis: true, // Include anamnesis data
        evaluations: {
          orderBy: { createdAt: 'asc' },
          include: {
            photos: true,
          },
        },
        diets: { // Include all diets
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!client) {
      return new NextResponse('Client not found', { status: 404 });
    }

    // Render React component to HTML
    const html = renderToStaticMarkup(<ClientReport client={client} />);

    // Generate PDF from HTML
    const fileBuffer = await pdf.generatePdf({ content: html }, { format: 'A4' });

    // Return PDF as a response
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-${client.name}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF report:', error);
    return new NextResponse('Error generating PDF report', { status: 500 });
  }
}