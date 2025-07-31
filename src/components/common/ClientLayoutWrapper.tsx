'use client';

import { useAppSelector } from '@/hooks/useRedux';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import Wrapper from '@/components/ui/Wrapper';
import Image from 'next/image';

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    document.body.className = isLoginPage
      ? 'hold-transition login-page'
      : 'sidebar-mini sidebar-collapse sidebar-mini-hover layout-fixed layout-footer-fixed layout-navbar-fixed';
  }, [isLoginPage, hasMounted]);

  const auth = useAppSelector((state) => state.auth);
  const loading = !auth.token && !isLoginPage;

  console.log('Auth State:', auth);

  if (!hasMounted || loading) {
    return (
      <div className="preloader flex-column justify-content-center align-items-center" id="app-preloader">
        <Image 
          className="animation__shake"
          src="/logo-icon.png"
          alt="AdminLTELogo"
          height={60}
          width={60}
        />
      </div>
    );
  }

  return (
    <>
      {!isLoginPage && (
        <div className="preloader flex-column justify-content-center align-items-center d-none" id="app-preloader">
          <Image 
            className="animation__shake"
            src="/logo-icon.png"
            alt="AdminLTELogo"
            height={60}
            width={60}
          />
        </div>
      )}

      {isLoginPage ? children : <Wrapper>{children}</Wrapper>}
    </>
  );
}