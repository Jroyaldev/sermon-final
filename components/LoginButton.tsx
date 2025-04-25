'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button'; // Assuming you use shadcn/ui Button

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Button variant="outline" disabled>Loading...</Button>;
  }

  if (session) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>Welcome, {session.user?.name ?? session.user?.email}!</span>
        <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
      </div>
    );
  }

  return (
    <Button onClick={() => signIn('google')}>Sign in with Google</Button>
    // Add other providers as needed, e.g.:
    // <Button onClick={() => signIn('credentials', { redirect: false })}>Sign in with Email</Button>
  );
} 