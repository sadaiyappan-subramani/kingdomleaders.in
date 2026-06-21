import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Read the Apps Script Webhook URL from environment variables
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn('Warning: GOOGLE_SHEETS_WEBHOOK_URL environment variable is not defined. Data not sent to Google Sheets.');
      return NextResponse.json({ 
        success: true, 
        message: 'Registration simulated successfully (warning: GOOGLE_SHEETS_WEBHOOK_URL not set).' 
      });
    }

    // Forward the payload to the Google Apps Script Web App
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Google Webhook returned status: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error submitting registration to Google Sheets:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit registration' },
      { status: 500 }
    );
  }
}
