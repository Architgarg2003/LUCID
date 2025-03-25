'use client';
import { useState, MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NavbarProps {
  mobileMenu: boolean;
  setMobileMenu: (value: boolean) => void;
  color: string;
}

const Navbar: React.FC<NavbarProps> = ({ mobileMenu, setMobileMenu, color }) => {
  const [mobileSubMenu, setMobileSubMenu] = useState<string>('');
  const [mobileSubMenuSub, setMobileSubMenuSub] = useState<string>('');
  const [menuTitle, setMenuTitle] = useState<string>('');

  const handleMenu = () => {
    setMobileMenu(false);
    setMobileSubMenu('');
    setMobileSubMenuSub('');
  };

  const handleSubMenu = (e: MouseEvent<HTMLLIElement>, id: string | number) => {
    e.preventDefault();
    setMobileSubMenu(id.toString());

    if (e.currentTarget.tagName === 'A') {
      const content = (e.currentTarget as HTMLElement).firstChild?.textContent || '';
      setMenuTitle(content);
    } else {
      const content = (e.currentTarget.parentElement?.textContent) || '';
      setMenuTitle(content);
    }
  };

  const handleSubMenuSub = (e: MouseEvent<HTMLLIElement>, id: string | number) => {
    e.preventDefault();
    setMobileSubMenuSub(id.toString());

    if (e.currentTarget.tagName === 'A') {
      const content = (e.currentTarget as HTMLElement).firstChild?.textContent || '';
      setMenuTitle(content);
    } else {
      const content = (e.currentTarget.parentElement?.textContent) || '';
      setMenuTitle(content);
    }
  };

  const handleGoBack = () => {
    if (mobileSubMenuSub) {
      setMobileSubMenuSub('');
      return;
    }
    if (mobileSubMenu) {
      setMobileSubMenu('');
      return;
    }
  };

  return (
    <div className='menu-block-wrapper'>
      <div
        onClick={handleMenu}
        className={`menu-overlay ${mobileMenu && 'active'}`}
      />
      <nav
        className={`menu-block ${mobileMenu && 'active'}`}
        id='append-menu-header'
      >
        <div className={`mobile-menu-head ${mobileSubMenu && 'active'}`}>
          <div onClick={handleGoBack} className='go-back'>
            <Image
              className='dropdown-icon'
              src='/assets/img_placeholder/icon-black-long-arrow-right.svg'
              alt='cheveron-right'
              width={16}
              height={16}
            />
          </div>
          <div className='current-menu-title'>{menuTitle}</div>
          <div onClick={handleMenu} className='mobile-menu-close'>
            ×
          </div>
        </div>
        <ul className={`site-menu-main ${color}`}>
          <li className='nav-item'>
            <Link href='/' className='nav-link-item'>
              About Us
            </Link>
          </li>
          <li
            onClick={(e) => handleSubMenu(e, 2)}
            className='nav-item nav-item-has-children'
          >
            <Link href='#Feature' className='nav-link-item'>
              Features
            </Link>
          </li>
          <li
            onClick={(e) => handleSubMenu(e, 3)}
            className='nav-item nav-item-has-children'
          >
            <Link href='#Services' className='nav-link-item drop-trigger'>
              Services
            </Link>
          </li>
          <li className='nav-item'>
            <Link href='#Ourteam' className='nav-link-item'>
              Our Team
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
