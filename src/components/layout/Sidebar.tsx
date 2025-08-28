'use client';

import Link from 'next/link';
import Image from 'next/image';
import Nav from '../ui/Nav';
import Ul from '../ui/Ul';
import Li from '../ui/Li';
import { useEffect, useState } from 'react';

export default function Sidebar() {

  const [collapsed, setCollapsed] = useState(false);
  const [hoverExpand, setHoverExpand] = useState(false);

  // Add/remove body class like AdminLTE does
  // useEffect(() => {
  //   if (!collapsed && hoverExpand) {
  //     document.body.classList.remove('sidebar-collapse');
  //   } else {
  //     document.body.classList.add('sidebar-collapse');
  //   }
  // }, [collapsed, hoverExpand]);

  const handleLinkClick = () => {
  if (window.innerWidth <= 991) {
    // Mobile (AdminLTE breakpoint: 992px)
    document.body.classList.add('sidebar-collapse');
    document.body.classList.remove('sidebar-open');
    document.body.classList.add('sidebar-closed');
  } else {
    // Desktop
    document.body.classList.remove('sidebar-collapse');
    // document.body.classList.remove('sidebar-closed');
    // document.body.classList.add('sidebar-open');
  }
};
  
  return (
    <aside 
      className="main-sidebar main-sidebar-custom sidebar-dark-primary elevation-4"
      // onMouseEnter={() => setHoverExpand(true)}
      // onMouseLeave={() => setHoverExpand(false)}
    >
      <Link 
        href="/" 
        className="brand-link d-flex align-items-center"
        onClick={handleLinkClick}
      >
        <Image 
          src="/logo-icon.png" 
          alt="Arcgate" 
          className="brand-image img-circle elevation-3" 
          width={30}
          height={30}
        />
        <span className="brand-text font-weight-light d-block">
          <div>COMPLIANCE</div>
          <div>MONITORING</div>
        </span>
      </Link>

      <div 
        className="sidebar"
      >
        <Nav className="mt-4">
          <Ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <Li 
              className="nav-item"
              onClick={handleLinkClick}
            >
              <Link href="/" className="nav-link">
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>Dashboard</p>
              </Link>
            </Li>
            <Li className="nav-item">
              <Link href="/systems" className="nav-link" onClick={handleLinkClick}>
                <i className="nav-icon fas fa-cogs" />
                <p>Systems</p>
              </Link>
            </Li>
            <Li className="nav-item">
              <Link href="/rules" className="nav-link" onClick={handleLinkClick}>
                <i className="nav-icon fas fa-bars" />
                <p>Rules</p>
              </Link>
            </Li>
            <Li className="nav-item">
              <Link href="/groups" className="nav-link" onClick={handleLinkClick}>
                <i className="nav-icon fas fa-users" />
                <p>Groups</p>
              </Link>
            </Li>
            <Li className="nav-item">
              <Link href="#" className="nav-link disabled" onClick={handleLinkClick}>
                <i className="nav-icon fas fa-bell" />
                <p>Alerts</p>
              </Link>
            </Li>
            <Li className="nav-item">
              <Link href="#" className="nav-link disabled" onClick={handleLinkClick}>
                <i className="nav-icon fas fa-file" />
                <p>Reports</p>
              </Link>
            </Li>
          </Ul>
        </Nav>
      </div>

      <div className="sidebar-custom">
        <Link href="#" className="btn btn-link d-flex align-items-left disabled" onClick={handleLinkClick}>
          <i className="fas fa-cog"></i>
          {/* <p className="hide-on-collapse"> Settings</p> */}
        </Link>
      </div>

    </aside>
  );
}

