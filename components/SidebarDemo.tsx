"use client";
import React, { useMemo, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import logo from "@/public/logo.png";
import { Joystick, LayoutDashboard } from 'lucide-react';
import { BookOpenCheck } from 'lucide-react';
import { Speech } from 'lucide-react';
import { ListStart } from 'lucide-react';
import { TiStarOutline, TiStarFullOutline } from "react-icons/ti";


interface SidebarProps {
    children: React.ReactNode;
}

export function SidebarDemo({ children }: SidebarProps) {
    const { user } = useUser();
    const [open, setOpen] = useState(false);

    const links = useMemo(() => [
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: <LayoutDashboard className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Test",
            href: "/exploreTest",
            icon: <BookOpenCheck className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Interview",
            href: "/exploreInterview",
            icon: <Speech className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Bucketlist",
            href: "/wishlist",
            icon: <TiStarOutline className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        // {
        //     label: "Stage",
        //     href: "/Forum",
        //     icon: <Joystick className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        // },
    ], []);

    return (
        <div className={cn("flex flex-col md:flex-row w-full bg-black max-w-full mx-auto h-screen overflow-hidden sticky top-0")}>
            <Sidebar open={open} setOpen={setOpen} >
                <SidebarBody className=" justify-between gap-10 bg-black">
                    <div className=" flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2 ">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: user?.firstName || "Guest",
                                href: "#",
                                icon: <UserButton afterSignOutUrl="/" />,
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}

const Logo = () => (
    <Link href="/" className="font-normal flex space-x-2 pl-5  bg-white rounded-full items-center text-sm text-white py-1 relative z-20">
        {/* <Image height={40} width={40} src={logo} alt="Axiom logo" /> */}
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-medium text-black whitespace-pre"
        >
            Lucid
        </motion.span>
    </Link>
);

const LogoIcon = () => (
    <Link href="#" className="font-normal flex space-x-2 bg-white rounded-full p-1 items-center text-sm text-white py-1 relative z-20">
        <Image height={35} width={35} src={logo} alt="Axiom logo" />
    </Link>
);
