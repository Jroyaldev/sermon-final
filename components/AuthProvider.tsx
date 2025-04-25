'use client'; // Required for SessionProvider

import React from 'react';
import { SessionProvider } from 'next-auth/react';

interface AuthProviderProps {
  children: React.ReactNode;
  // session is optional, NextAuth automatically fetches it
  // session?: Session;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
} 