'use client';

import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '@/store';

export default function BodyThemeManager() {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return null;
}