'use client';

import Image from 'next/image';
import Link from 'next/link';
import useAccordion from '@/components/hooks/useAccordian';
import useTabs from '@/components/hooks/useTabs';
import Header_01 from '@/components/header/Header_01';
import Footer_01 from '@/components/footer/Footer_01';
import TeamMemberCard from '@/components/profile';
import localFont from 'next/font/local';
import { Inter } from 'next/font/google';
import '@/styles/global.css'
import { useAuth } from '@clerk/clerk-react';
import { useReducer } from 'react';
import { useRouter } from 'next/navigation';
import llp from '@/public/llp.png';

const DMSans = localFont({
  src: '../fonts/DMSans-Bold.woff2',
  variable: '--font-DMSans',
});

const ClashDisplay = localFont({
  src: '../fonts/ClashDisplay-Medium.woff2',
  variable: '--font-clash-display',
});

const Raleway = localFont({
  src: '../fonts/Raleway-Bold.woff2',
  variable: '--font-raleway',
});

const SpaceGrotesk = localFont({
  src: '../fonts/SpaceGrotesk-Bold.woff2',
  variable: '--font-space-grotesk',
});

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Define types for social links
interface SocialLinks {
  github?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
}

// Define type for TeamMemberCard props
interface TeamMemberCardProps {
  name: string;
  role: string;
  imageSrc: string;
  socialLinks: SocialLinks;
}

function Home(): JSX.Element {

    const { userId } = useAuth();

    const router = useRouter();

    if(userId){
      router.push('/exploreTest')
    }

  return (
    <div className={`page-wrapper relative z-[1] bg-white ${DMSans.variable} ${ClashDisplay.variable} ${Raleway.variable} ${SpaceGrotesk.variable} ${inter.variable}`}>
      {/* <Header_01 /> */}
      <main className='main-wrapper relative overflow-hidden'>
        {/* Hero Section */}
        <section id='section-hero'>
          <div className='relative z-[1] overflow-hidden rounded-bl-[30px] rounded-br-[30px] bg-[#efeae3] pb-20 pt-28 lg:rounded-bl-[50px] lg:rounded-br-[50px] lg:pb-24 lg:pt-32 xl:pt-40 xxl:pb-[133px] xxl:pt-[195px]'>
            <div className='global-container'>
              <div className='mb-14 flex flex-col items-center text-center lg:mb-20'>
                <h1 className='jos slide-from-bottom mb-6 max-w-[510px] lg:max-w-[768px] xl:max-w-[1076px]'>
                  LUCID
                </h1>
                <p className='jos slide-from-bottom mb-11 max-w-[700px] text-lg font-semibold sm:text-xl xl:max-w-[980px]'>
                Lucid is the connected workspace where better, faster work happens.
                </p>
                <div
                  className='jos flex flex-wrap justify-center gap-6'
                  data-jos_animation='fade'
                >
                  <Link
                    href='/sign-in'
                    className='button rounded-[50px] border-2 border-black bg-black py-4 text-white hover:border-[#f15bb5] hover:text-white'
                  >
                    Get started for free
                  </Link>
                </div>
              </div>
              <div
                className='jos hero-img overflow-hidden rounded-2xl bg-black'
                data-jos_animation='zoom'
              >
                <Image
                  src={llp}
                  alt='hero-dashboard'
                  width={1296}
                  height={640}
                  className='h-auto w-full'
                />
              </div>
            </div>
            <div className='orange-gradient-1 absolute -right-[150px] top-[370px] -z-[1] h-[500px] w-[500px] animate-spin rounded-[500px]'></div>
            <div className='blue-gradient-2 absolute right-[57px] top-[620px] -z-[1] h-[450px] w-[450px] animate-spin rounded-[450px]'></div>
          </div>
        </section>

       </main>
      {/* <Footer_01 /> */}
    </div>
  );
}

export default Home;