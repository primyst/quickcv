import { NextRequest, NextResponse } from 'next/server';
import vision from '@google-cloud/vision';

// Create Vision API client securely using Vercel environment variables
const client = new vision.ImageAnnotatorClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  projectId: process.env.GOOGLE_PROJECT_ID,
});

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, mimeType } = await request.json();

    if (!imageBase64 || !mimeType) {
      return NextResponse.json(
        { error: 'Missing imageBase64 or mimeType' },
        { status: 400 }
      );
    }

    // Remove base64 header if it exists (e.g., "data:image/png;base64,")
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // Send image to Google Vision
    const [result] = await client.annotateImage({
      image: { content: cleanBase64 },
      features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
    });

    const fullText = result.textAnnotations?.[0]?.description || '';
    const confidence = result.fullTextAnnotation?.pages?.[0]?.blocks?.[0]?.confidence || 0;

    return NextResponse.json({
      success: true,
      text: fullText,
      confidence: confidence,
      message: 'Text extracted successfully',
    });
  } catch (error: any) {
    console.error('Vision API error:', error);
    return NextResponse.json(
      { error: 'Failed to extract text. Please try again.' },
      { status: 500 }
    );
  }
      }
