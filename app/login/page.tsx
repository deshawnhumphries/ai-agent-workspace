'use client';

import dynamic from 'next/dynamic';

const LoginPageContent = dynamic(() => import('@/components/auth/login-content'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  ),
});

export default function LoginPage() {
  return <LoginPageContent />;
}
