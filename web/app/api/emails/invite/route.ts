import { EmailInvite } from '@/lib/email-templates/email-invite';
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

const staffMobileDownloadUrl =
  process.env.STAFF_MOBILE_DOWNLOAD_URL?.trim() ||
  process.env.MOBILE_APP_DOWNLOAD_URL?.trim() ||
  '';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, role, department, tempPassword } = body;
    const isStaffInvite =
      String(role ?? '')
        .trim()
        .toLowerCase() === 'staff';

    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
    }

    // Render the React Email component to an HTML string
    const emailHtml = await render(
      EmailInvite({
        name,
        email,
        role,
        department,
        tempPassword,
        mobileAppDownloadUrl: isStaffInvite ? staffMobileDownloadUrl : undefined,
      }),
    );

    // Send the email using Gmail SMTP
    const msg = {
      to: email,
      from: process.env.GMAIL_USER as string,
      subject: 'You have been invited to MIRA',
      html: emailHtml,
    };

    await transporter.sendMail(msg);

    return NextResponse.json({ success: true, message: 'Email sent' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error sending Gmail SMTP invite email:', error);


    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 },
    );
  }
}
