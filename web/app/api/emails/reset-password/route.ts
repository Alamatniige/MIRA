import { EmailResetPassword } from '@/lib/email-templates/email-reset-password';
import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { render } from '@react-email/render';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

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
      from: 'bogaratats@outlook.com',
      subject: 'Your MIRA Password Reset Code',
      html: emailHtml,
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true, message: 'Reset code sent' });
  } catch (error: unknown) {
    console.error('Error sending reset-password email:', error);
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
