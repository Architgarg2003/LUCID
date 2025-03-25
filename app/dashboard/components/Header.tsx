import React from 'react'
import { useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"
import Greeting from './Greeting'
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { SquareChartGantt } from 'lucide-react';
import { Flame } from 'lucide-react';

interface HeaderI{
    rank:any;
    maxStreak:any;
    handleModalOpen:()=>void;
} 

const Header = ({ rank, maxStreak, handleModalOpen }: HeaderI) => {

    const { user } = useUser();
    const router = useRouter();

    if (!user) {
        router.replace('/sign-in')
    }

    return (
        <div className="flex font-sans flex-col justify-between items-start w-full pb-2 pt-5">
            <div className="flex items-center justify-between w-full">
                <div className="bg-white h-max w-max p-1 rounded-full flex items-center justify-start shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)]">
                    <UserButton />
                </div>
                <div className="flex flex-row items-center gap-2 sm:gap-5">
                    <Button
                        onClick={handleModalOpen}
                        className="px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base md:text-lg text-white rounded-full flex items-center w-max gap-2 sm:gap-3"
                    >
                        Resume <SquareChartGantt />
                    </Button>
                    <div className="px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base md:text-lg text-white bg-[#7C3AED] rounded-full flex items-center w-max gap-2 sm:gap-3">
                        {maxStreak} <Flame />
                    </div>
                </div>
            </div>
            <div className="pt-5 sm:pt-7 flex flex-col sm:flex-row justify-between w-full">
                <div>
                    <h1 className="flex flex-col items-start gap-2 sm:gap-3">
                        <span className="text-sm sm:text-lg font-semibold text-gray-600">
                            <Greeting />
                        </span>
                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-black flex flex-row gap-2">
                            {user?.firstName}
                        </span>
                    </h1>
                </div>
                <div className="mt-4 sm:mt-0">
                    <h1 className="flex flex-row items-center gap-1 md:w-full w-[50%] bg-white p-2 sm:p-3 rounded-2xl sm:rounded-3xl">
                        <p className="text-sm sm:text-lg font-semibold text-gray-600">
                            Global Rank
                        </p>
                        <span className="text-xl sm:text-2xl text-black p-1 sm:p-2  rounded-full font-bold flex flex-row gap-2">
                            {rank}
                        </span>
                    </h1>
                </div>
            </div>
        </div>

    )
}

export default Header