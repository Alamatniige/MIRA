'use client';

import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export enum ForgotPasswordStep {
  Email = 'email',
  OTP = 'otp',
  NewPassword = 'newPassword',
  Success = 'success',
}

interface ForgotPasswordState {
  step: ForgotPasswordStep;
  email: string;
  resetToken: string;
  isLoading: boolean;
  error: string | null;
  expirySeconds: number;
}

export function useForgotPassword() {
  const [state, setState] = useState<ForgotPasswordState>({
    step: ForgotPasswordStep.Email,
    email: '',
    resetToken: '',
    isLoading: false,
    error: null,
    expirySeconds: 0,
  });

  const MAX_EXPIRY = 600; // 10 minutes

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state.step === ForgotPasswordStep.OTP && state.expirySeconds > 0) {
      timer = setInterval(() => {
        setState((prev) => ({
          ...prev,
          expirySeconds: Math.max(0, prev.expirySeconds - 1),
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [state.step, state.expirySeconds]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const submitEmail = async (email: string) => {
    const trimmed = email.trim();
    if (!trimmed) {
      setState((prev) => ({ ...prev, error: 'Please enter your registered email address.' }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await apiClient<{ message: string }>('/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: trimmed }),
      });

      setState((prev) => ({
        ...prev,
        email: trimmed,
        step: ForgotPasswordStep.OTP,
        expirySeconds: MAX_EXPIRY,
        isLoading: false,
      }));
    } catch (err: unknown) {
      setState((prev) => ({
        ...prev,
        error:
          (err as { message: string }).message || 'An unexpected error occurred. Please try again.',
        isLoading: false,
      }));
    }
  };

  const verifyOtp = async (otp: string) => {
    const trimmed = otp.trim();
    if (trimmed.length !== 6) {
      setState((prev) => ({ ...prev, error: 'Please enter the 6-digit code from your email.' }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiClient<{ message: string; reset_token: string }>('/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email: state.email, otp: trimmed }),
      });

      setState((prev) => ({
        ...prev,
        resetToken: response.reset_token,
        step: ForgotPasswordStep.NewPassword,
        isLoading: false,
      }));
    } catch (err: unknown) {
      setState((prev) => ({
        ...prev,
        error:
          (err as { message: string }).message || 'An unexpected error occurred. Please try again.',
        isLoading: false,
      }));
    }
  };

  const resetPassword = async (newPassword: string, confirmPassword: string) => {
    if (newPassword !== confirmPassword) {
      setState((prev) => ({ ...prev, error: 'Passwords do not match.' }));
      return;
    }

    if (newPassword.length < 8) {
      setState((prev) => ({ ...prev, error: 'Password must be at least 8 characters.' }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await apiClient<{ message: string }>('/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          reset_token: state.resetToken,
          new_password: newPassword,
        }),
      });

      setState((prev) => ({
        ...prev,
        step: ForgotPasswordStep.Success,
        isLoading: false,
      }));
    } catch (err: unknown) {
      setState((prev) => ({
        ...prev,
        error:
          (err as { message: string }).message || 'An unexpected error occurred. Please try again.',
        isLoading: false,
      }));
    }
  };

  const resendOtp = async () => {
    setState((prev) => ({
      ...prev,
      step: ForgotPasswordStep.Email,
      error: null,
    }));
    await submitEmail(state.email);
  };

  return {
    ...state,
    submitEmail,
    verifyOtp,
    resetPassword,
    resendOtp,
    clearError,
  };
}
