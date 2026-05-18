import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Vercel'e eklediğin RESEND_API_KEY'i otomatik olarak buradan çekecek
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();

    const data = await resend.emails.send({
      from: 'Ruyatevili <hello@ruyatevili.com>', // Doğruladığın domain
      to: [to],
      subject: subject,
      html: html,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}