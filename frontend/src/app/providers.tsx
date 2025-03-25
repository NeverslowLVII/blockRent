'use client';

import React, { ReactNode } from 'react';
import Layout from '@/components/ui/Layout';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <Layout>{children}</Layout>;
} 