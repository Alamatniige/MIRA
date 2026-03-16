import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password | MIRA',
  description: 'Reset your MIRA account password.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
