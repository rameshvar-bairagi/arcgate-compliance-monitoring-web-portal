'use client';

import { useEffect } from 'react';

export default function PreloaderManager() {
  useEffect(() => {
    const preloader = document.getElementById('app-preloader');
    if (preloader) {
      preloader.style.display = 'none';
    }
  }, []);

  return null;
}
