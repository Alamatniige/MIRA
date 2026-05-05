import { EmailResetPassword } from '@/lib/email-templates/email-reset-password';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';

// Initialize Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER as string,
    pass: process.env.GMAIL_APP_PASSWORD as string,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and otp are required' }, { status: 400 });
    }

    const emailHtml = await render(EmailResetPassword({ name: name ?? 'User', otp }));

    const msg = {
      to: email,
      from: process.env.GMAIL_USER as string,
      subject: 'Your MIRA Password Reset Code',
      html: emailHtml,
    };

    await transporter.sendMail(msg);

    return NextResponse.json({ success: true, message: 'Reset code sent' });
  } catch (error: unknown) {
    console.error('Error sending Gmail SMTP reset-password email:', error);
    if (error instanceof Error) {
      console.error(error.message);
    }
    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
