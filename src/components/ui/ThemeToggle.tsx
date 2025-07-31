'use client';

import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '@/store/slices/themeSlice';
import { RootState } from '@/store';
import Link from 'next/link';

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <li className="nav-item">
      {/* <button className="btn btn-sm btn-secondary ml-2" onClick={() => dispatch(toggleTheme())}>
        {darkMode ? '☀ Light' : '🌙 Dark'}
      </button> */}
      <Link className="nav-link" href="#" role="button" onClick={() => dispatch(toggleTheme())}>
        {darkMode ? '☀' : '🌙'}
      </Link>
    </li>
  );
}
