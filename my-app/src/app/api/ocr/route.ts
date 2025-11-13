import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    console.log('Processing file with OCR.space')

    // Get API key from environment
    const apiKey = process.env.OCR_SPACE_API_KEY || 'K87899142372222'
    
    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    // Create form data for OCR.space
    const ocrFormData = new FormData()
    ocrFormData.append('apikey', apiKey)
    ocrFormData.append('base64Image', `data:${file.type};base64,${base64}`)
    ocrFormData.append('language', 'eng')

    console.log('Sending request to OCR.space API...')

    const response = await fetch('https://api.ocr.space/parse', {
      method: 'POST',
      body: ocrFormData,
    })

    console.log('Response status:', response.status)
    const responseText = await response.text()
    console.log('Response:', responseText)

    // Try to parse as JSON
    let ocrResult
    try {
      ocrResult = JSON.parse(responseText)
    } catch (e) {
      console.error('Failed to parse JSON response:', responseText.substring(0, 200))
      throw new Error('Invalid response from OCR.space API')
    }

    if (ocrResult.IsErroredOnProcessing) {
      throw new Error(ocrResult.ErrorMessage || 'OCR processing failed')
    }

    if (!ocrResult.ParsedText) {
      return NextResponse.json(
        { error: 'No text detected in image' },
        { status: 400 }
      )
    }

    const extractedText = ocrResult.ParsedText.trim()

    console.log('OCR completed successfully')

    return NextResponse.json(
      {
        text: extractedText,
        confidence: ocrResult.Confidence || 0,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('OCR Error:', error.message)

    return NextResponse.json(
      {
        error: 'OCR processing failed',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}