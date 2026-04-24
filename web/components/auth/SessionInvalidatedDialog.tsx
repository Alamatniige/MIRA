'use client';

import { useEffect, useState, useRef } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function SessionInvalidatedDialog() {
  const { sessionInvalidated, clearSessionInvalidated, logout } = useAuth();
  const [countdown, setCountdown] = useState(10);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!sessionInvalidated) return;

    setCountdown(10);

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          clearSessionInvalidated();
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sessionInvalidated]);

  const handleReturnToLogin = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    clearSessionInvalidated();
    logout();
  };

  return (
    <Dialog open={sessionInvalidated} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="max-w-[420px] p-0 overflow-hidden border border-border/50 shadow-2xl bg-card">
        {/* Premium subtle gradient top bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-destructive/40 via-destructive to-destructive/40" />
        
        <div className="flex flex-col items-center text-center p-8">
          <div className="relative flex items-center justify-center size-20 rounded-full bg-destructive/5 mb-6">
            <div className="absolute inset-0 rounded-full bg-destructive/10 animate-ping opacity-75 duration-1000" />
            <ShieldAlert className="size-10 text-destructive relative z-10" />
          </div>
          
          <DialogHeader className="flex flex-col items-center space-y-2 mb-2 w-full m-0 p-0 text-center">
            <DialogTitle className="text-h4 font-semibold tracking-tight text-foreground">
              Session Terminated
            </DialogTitle>
            <DialogDescription className="text-body text-muted-foreground max-w-[280px]">
              Your account was signed in on another device. For your security, you have been automatically logged out of this session.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="w-full mt-8 sm:flex-col">
            <Button
              id="session-invalidated-login-btn"
              onClick={handleReturnToLogin}
              className="w-full h-12 text-body-lg font-medium bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Return to Login ({countdown}s)
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
