import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SocialLinks {
  [key: string]: string;
}

interface TeamMemberCardProps {
  name: string;
  role: string;
  imageSrc: string;
  socialLinks: SocialLinks;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ name, role, imageSrc, socialLinks }) => {
  return (
    <li
      className="jos rounded-[15px] bg-[#efeae3] p-[15px] w-full md:max-w-[320px] md:h-[384px] lg:max-w-[320px] lg:h-[384px]"
      data-jos_animation="flip"
      data-jos_delay="0.2"
    >
      <div className="w-full overflow-hidden rounded-[15px] h-[250px] xxl:h-[250px]">
        <Image
          src={imageSrc}
          alt={`${name}-image`}
          width={300}
          height={300}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-3">
        <div
          className="font-dmSans text-[20px] leading-[1.2] hover:text-[#AE67FBFF] xxl:text-[24px]"
        >
          {name}
        </div>
        <div className="mt-2 flex flex-row justify-between gap-2 xxl:flex-row xxl:flex-wrap xxl:items-center">
          <span className="text-[16px]">{role}</span>
          <ul className="mt-auto flex gap-x-[10px]">
            {Object.keys(socialLinks).map((social) => (
              <li key={social}>
                <Link
                  rel="noopener noreferrer"
                  href={socialLinks[social]}
                  className="group relative flex h-[25px] w-[25px] items-center justify-center rounded-[50%] bg-black hover:bg-[#AE67FBFF]"
                >
                  <Image
                    src={`/assets/img_placeholder/th-1/${social}-icon-white.svg`}
                    alt={social}
                    width={12}
                    height={12}
                    className="opacity-100 group-hover:opacity-0"
                  />
                  <Image
                    src={`/assets/img_placeholder/th-1/${social}-icon-black.svg`}
                    alt={social}
                    width={12}
                    height={12}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
};

export default TeamMemberCard;
