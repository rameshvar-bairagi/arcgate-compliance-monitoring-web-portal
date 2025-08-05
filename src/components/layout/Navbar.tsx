'use client';

import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../ui/ThemeToggle';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../ui/Button';
import Li from '../ui/Li';
import Ul from '../ui/Ul';
import Nav from '../ui/Nav';

export default function Navbar() {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLLIElement>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const userProfile = useAppSelector((state) => state.auth.userProfile);
    console.log(userProfile, 'userProfile');

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    return (
        <Nav className="main-header navbar navbar-expand navbar-white navbar-light">
            {/* Left section with toggle button */}
            <Ul className="navbar-nav">
                <Li className="nav-item">
                    <Link className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></Link>
                </Li>
                {/* <Li className="nav-item d-none d-sm-inline-block">
                    <a href="../../index3.html" className="nav-link">Home</a>
                </Li>
                <Li className="nav-item d-none d-sm-inline-block">
                    <a href="#" className="nav-link">Contact</a>
                </Li> */}
            </Ul>

            {/* Right navbar links */}
            <Ul className="navbar-nav ml-auto">
                {/* Navbar Search */}
                {/* <Li className="nav-item">
                    <Link className="nav-link" data-widget="navbar-search" href="#" role="button">
                        <i className="fas fa-search"></i>
                    </Link>
                    <div className="navbar-search-block">
                    <form className="form-inline">
                        <div className="input-group input-group-sm">
                            <input className="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search" />
                            <div className="input-group-append">
                                <Button className="btn btn-navbar" type="submit">
                                    <i className="fas fa-search"></i>
                                </Button>
                                <Button className="btn btn-navbar" type="button" data-widget="navbar-search">
                                    <i className="fas fa-times"></i>
                                </Button>
                            </div>
                        </div>
                    </form>
                    </div>
                </Li> */}

                <Li className="nav-item">
                    <Link className="nav-link" data-widget="fullscreen" href="#" role="button">
                        <i className="fas fa-expand-arrows-alt"></i>
                    </Link>
                </Li>
                <ThemeToggle />

                <Li className="nav-item dropdown" ref={dropdownRef}>
                    <Link
                        className="nav-link"
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setDropdownOpen(!dropdownOpen);
                        }}
                    >
                        <Image
                            src="/logo-icon.png"
                            alt="User Avatar"
                            className="img-circle elevation-2"
                            width={30}
                            height={30}
                        />
                    </Link>

                    {dropdownOpen && (
                        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right show" style={{ position: 'absolute', right: 0 }}>
                        <span className="dropdown-item-text"><i className="fas fa-user mr-2"></i> {userProfile?.username}</span>
                        <div className="dropdown-divider" />
                            <Button onClick={handleLogout} className="dropdown-item">
                                <i className="fas fa-sign-out-alt mr-2"></i> Logout
                            </Button>
                        </div>
                    )}
                </Li>
            </Ul>
        </Nav>
    );
}
