import Image from 'next/image';
import Link from 'next/link';

const Footer_01: React.FC = () => {
  return (
    <footer className='relative z-[1] -mt-[70px] overflow-hidden rounded-tl-[30px] rounded-tr-[30px] bg-[#efeae3] lg:rounded-tl-[50px] lg:rounded-tr-[50px]'>
    {/* Footer Top */}
    <div className='py-[60px] xl:pb-[100px] xl:pt-[130px]'>
      <div className='overflow-hidden'>
        {/* Footer Text Slider */}
        <div className='footer-text-slider flex w-full items-center gap-x-[30px] whitespace-nowrap'>
          {/* Footer Slide Item  */}
          <Image
            src='/assets/img_placeholder/th-1/footer-text-slider-icon.svg'
            alt='footer-text-slider-icon'
            width={60}
            height={60}
            className='h-10 w-10 lg:h-[60px] lg:w-[60px]'
          />
          <div className='block font-dmSans text-4xl font-bold leading-none -tracking-[2px] text-black lg:text-6xl xl:text-7xl xxl:text-[80px]'>
            Master Every Interview
          </div>
          {/* Footer Slide Item  */}
          {/* Footer Slide Item  */}
          <Image
            src='/assets/img_placeholder/th-1/footer-text-slider-icon.svg'
            alt='footer-text-slider-icon'
            width={60}
            height={60}
            className='h-10 w-10 lg:h-[60px] lg:w-[60px]'
          />
          <div className='block font-dmSans text-4xl font-bold leading-none -tracking-[2px] text-black lg:text-6xl xl:text-7xl xxl:text-[80px]'>
            Advance Your Career
          </div>
          {/* Footer Slide Item  */}
          {/* Footer Slide Item  */}
          <Image
            src='/assets/img_placeholder/th-1/footer-text-slider-icon.svg'
            alt='footer-text-slider-icon'
            width={60}
            height={60}
            className='h-10 w-10 lg:h-[60px] lg:w-[60px]'
          />
          <div className='block font-dmSans text-4xl font-bold leading-none -tracking-[2px] text-black lg:text-6xl xl:text-7xl xxl:text-[80px]'>
            Interactive Career Growth
          </div>
          {/* Footer Slide Item  */}
        </div>
      </div>
    </div>
    {/* Footer Text Slider */}
    {/* Footer Top */}
    <div className='global-container'>
      <div className='h-[1px] w-full bg-[#DBD6CF]' />
      {/* Footer Center */}
      <div className='lg grid grid-cols-1 gap-10 py-[60px] md:grid-cols-[1fr_auto_auto] xl:grid-cols-[1fr_auto_auto_1fr] xl:gap-20 xl:py-[100px]'>
        {/* Footer Widget */}
        <div className='flex flex-col gap-y-6'>
          <Link href='/' className='inline-block ' >
          <div className=' flex flex-row'>
            <Image
              src='/assets/img_placeholder/th-1/logo2.png'
              alt='logo'
              width={80} // Increase these for better visibility
              height={80}
              className='w-[30px] h-[28px]'
            />
            <p className='text-2xl font-bold pl-1'>   Axiom</p>
            </div>
          </Link>
          <p>
            At Axiom, our goal is to simplify the job preparation process for undergraduates and freshers by leveraging AI to offer intelligent, personalized insights and an engaging experience.
          </p>
        </div>
        {/* Footer Widget */}
        {/* Footer Widget */}
        <div className='flex flex-col gap-y-6'>
          {/* Footer Title */}
          <h4 className='text-[21px] font-semibold capitalize text-black'>
            Primary Pages
          </h4>
          {/* Footer Title */}
          {/* Footer Navbar */}
          <ul className='flex flex-col gap-y-[10px] capitalize'>
            <li>
              <Link
                href='/'
                className='transition-all duration-300 ease-linear hover:text-[#AE67FBFF]'
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href='#Features'
                className='transition-all duration-300 ease-linear hover:text-[#AE67FBFF]'
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href='#Services'
                className='transition-all duration-300 ease-linear hover:text-[#AE67FBFF]'
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href='#Ourteam'
                className='transition-all duration-300 ease-linear hover:text-[#AE67FBFF]'
              >
                Our Team
              </Link>
            </li>
          </ul>
        </div>
        {/* Footer Widget */}
        {/* Footer Widget */}
        <div className='flex flex-col gap-y-6'>
          {/* Footer Title */}
          <h4 className='text-[21px] font-semibold capitalize text-black'>
            Utility pages
          </h4>
          {/* Footer Title */}
          {/* Footer Navbar */}
          <ul className='flex flex-col gap-y-[10px] capitalize'>
            <li>
              <Link
                href='/sign-up'
                className='transition-all duration-300 ease-linear hover:text-[#AE67FBFF]'
              >
                Signup
              </Link>
            </li>
            <li>
              <Link
                href='/sign-in'
                className='transition-all duration-300 ease-linear hover:text-[#AE67FBFF]'
              >
                Login
              </Link>
            </li>

          </ul>
        </div>
        {/* Footer Widget */}
        {/* Footer Widget */}
        </div>
      {/* Footer Center */}
      <div className='h-[1px] w-full bg-[#DBD6CF]' />
      {/* Footer Bottom */}
      <div className='py-9 text-center'>
        <p>
          © Copyright {new Date().getFullYear()}, All Rights Reserved by
          Axiom
        </p>
      </div>
      {/* Footer Bottom */}
    </div>
    {/* Footer Background Shape 1  */}
    <div className='orange-gradient-2 absolute -top-[290px] right-[90px] -z-[1] h-[406px] w-[406px] -rotate-[58deg] rounded-[406px]'></div>
    {/* Footer Background Shape 2  */}
    <div className='orange-gradient-1 absolute -right-[200px] -top-[205px] -z-[1] h-[451px] w-[451px] -rotate-[58deg] rounded-[451px]'></div>
  </footer>
);
};

export default Footer_01;