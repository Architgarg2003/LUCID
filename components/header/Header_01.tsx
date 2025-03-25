'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../navbar/Navbar';
import LogoDark from '../logo/LogoDark';

// No props needed, so we don't need a props interface here.
const Header_01: React.FC = () => {
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);

  return (
    <header className='site-header site-header--absolute is--white py-3' id='sticky-menu'>
      <div className='global-container'>
        <div className='flex items-center justify-between gap-x-8'>
          {/* Header Logo */}
          <LogoDark />
          {/* Header Navigation */}
          <Navbar mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} color={''} />
          {/* Header User Event */}
          <div className='flex items-center gap-6'>
            {/* Commented Login Link */}
            {/* <Link
              href='/login'
              className='button hidden rounded-[50px] border-[#7F8995] bg-transparent text-black after:bg-colorOrangyRed hover:border-colorOrangyRed hover:text-white lg:inline-block'
            >
              Login
            </Link> */}
            <Link
              href='/sign-in'
              className='button hidden rounded-[50px] border-black bg-black text-white hover:border-[#f15bb5] hover:text-white lg:inline-block'
            >
              Get Started
            </Link>
            {/* Responsive Off-canvas Menu Button */}
            <div className='block lg:hidden'>
              <button
                onClick={() => setMobileMenu(true)}
                className='mobile-menu-trigger is-black'
              >
                <span />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header_01;
