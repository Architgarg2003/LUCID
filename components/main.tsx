"use client";

import { useUser } from "@clerk/nextjs";
import React from 'react';
import { Separator } from "@/components/ui/separator";
import {Button} from "@nextui-org/react"
import {Plus} from "lucide-react"
import Featured from "./Featured";
import GeneratedTests from "./GeneratedTests";
const Main = () => {

    return (
        <main className="h-full w-screen min-h-screen bg-gray-200">
            <div className="flex flex-row justify-between">
                <div className="p-10 pb-2">
                    <h1 className="flex flex-col items-start gap-3">
                        <span className="text-lg font-semibold text-gray-600">
                            Welcome to
                        </span>
                        <span className="text-4xl font-bold text-[#7c3aed] flex flex-row gap-2">
                            Axiom 
                            <span className="text-black">
                                Tests
                            </span>
                            
                        </span>
                    </h1>
                </div>
                <div className="px-20 py-[4.5rem] pb-2">
                    <Button
                        radius="full"
                        className='bg-black text-white capitalize inline-flex'
                        size="md"
                    >
                        create new <Plus />
                    </Button>
                </div>
            </div>
            <div>
                <Separator className="bg-gray-400 w-[92%] ml-10"/>
            </div>
            <Featured/>
            <GeneratedTests/>
        </main>
    );
};

export default Main;
