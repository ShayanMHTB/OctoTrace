import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AuthAside from '@/components/auth/AuthAside';
import GuestGuard from '@/components/auth/GuestGuard';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in — OctoTrace',
  description: 'Connect your GitHub account to explore your OctoTrace analytics.',
};

export default function AuthPage() {
  return (
    <GuestGuard>
      <div className="grid min-h-dvh lg:grid-cols-2">
        <AuthAside />
        <div className="relative">
          <Link
            href="/"
            className="absolute left-6 top-6 z-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back home
          </Link>
          <LoginForm />
        </div>
      </div>
    </GuestGuard>
  );
}
