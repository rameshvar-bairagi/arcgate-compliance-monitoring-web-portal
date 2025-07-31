'use client';

import { useEffect } from 'react';

export default function AdminScripts() {
  useEffect(() => {
    import('admin-lte/dist/js/adminlte.min.js');
  }, []);

  return null;
}
