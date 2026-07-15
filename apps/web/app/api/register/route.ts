import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1. Forward the payload to the NestJS PostgreSQL Backend
    const nestjsApiUrl = process.env.NESTJS_API_URL || 'http://localhost:3001';
    console.log(`Forwarding registration to NestJS backend at: ${nestjsApiUrl}/registrations`);
    
    const dbResponse = await fetch(`${nestjsApiUrl}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!dbResponse.ok) {
      const errorText = await dbResponse.text();
      throw new Error(`NestJS backend returned status: ${dbResponse.status} - ${errorText}`);
    }

    const dbResult = await dbResponse.json();

    // 2. Forward the payload to the Google Apps Script Web App (optional/legacy)
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (webhookUrl && !webhookUrl.includes('YOUR_DEPLOYED_WEB_APP_ID_HERE')) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      } catch (sheetError) {
        console.error('Warning: Failed to forward registration to Google Sheets:', sheetError);
        // Do not fail the request if Google Sheets fails, as the database save succeeded
      }
    }

    return NextResponse.json({ success: true, data: dbResult.data });
  } catch (error: any) {
    console.error('Error submitting registration:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit registration' },
      { status: 500 }
    );
  }
}
