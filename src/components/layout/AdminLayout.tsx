'use client';

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Wrapper from '../ui/Wrapper';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Wrapper>
      <Navbar />
      <Sidebar />
      {children}
      <Footer />
    </Wrapper>
  );
}
