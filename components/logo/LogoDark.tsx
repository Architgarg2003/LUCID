import Image from 'next/image';
import Link from 'next/link';

// No props are needed for this component, so we don't need to define a props interface.
const LogoDark: React.FC = () => {
  return (
    <Link href='/'>
      <div className='flex flex-row'>
        <Image
          src='/assets/img_placeholder/th-1/logo2.png'
          alt='logo'
          width={80} // Adjusted for visibility
          height={80}
          className='w-[35px] h-[33px]'
        />
        <p className='text-3xl font-bold pl-1'>Axiom</p>
      </div>
    </Link>
  );
};

export default LogoDark;
