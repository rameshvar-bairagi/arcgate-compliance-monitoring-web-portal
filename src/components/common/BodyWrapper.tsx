// src/components/common/BodyWrapper.tsx
'use client';
import { ReactNode } from 'react';

export default function BodyWrapper({ children }: { children: ReactNode }) {
  return <body>{children}</body>;
}