-- Migration: Add password_reset_otps table for OTP-based password reset flow

CREATE TABLE IF NOT EXISTS public.password_reset_otps (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  otp_hash     TEXT NOT NULL,
  reset_token  UUID,
  expires_at   TIMESTAMPTZ NOT NULL,
  used         BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_otps_user_id    ON public.password_reset_otps(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_otps_reset_token ON public.password_reset_otps(reset_token)
  WHERE reset_token IS NOT NULL;
