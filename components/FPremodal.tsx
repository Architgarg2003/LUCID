"use client"
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogDescription,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


interface FPreModalI {
    companyName?: string;
    jobTitle?: string;
    tags?: string[];
    testId?: string;
    isInterview?:boolean
    interviewId?:any
}


const FPreModal = ({ isInterview, companyName, jobTitle, tags, testId, interviewId }: FPreModalI) => {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768); // Adjust this breakpoint as needed
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);


    const handleStart = () => {
        if (isInterview) {
            router.push(`interview/${interviewId}/featuredStart`);
        } else {
            router.push(`/${testId}/featuredStart`);
        }
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="bg-[#141414] rounded-full text-white px-3 py-1 cursor-pointer">
                    Details
                </div>
            </DialogTrigger>
            <DialogContent className={isMobile ? "w-[90%] max-w-[400px]" : "h-max w-[90rem]"}>
                {isMobile ? (
                    <div className="p-4 text-center">
                        <p className="text-lg font-semibold mb-2">Please use a laptop or PC</p>
                        <p>For the best experience, please use a larger screen to take this test.</p>
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Description</DialogTitle>
                            <DialogDescription>
                                Read the details carefully before starting the test.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="text-wrap overflow-hidden w-auto">
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Job Title</TableHead>
                                        <TableCell className="font-medium">{jobTitle}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Company</TableHead>
                                        <TableCell className="font-medium">{companyName}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Job Description</TableHead>
                                        <TableCell className="font-medium ">
                                            {tags?.map((tag, index) => (
                                                <span key={index} className="flex gap-3">
                                                    {tag}
                                                </span>
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <DialogFooter>
                            <Button
                                className="bg-[#141414] text-white p-3 rounded-full"
                                size="sm"
                                onClick={handleStart}
                            >
                                Start
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default FPreModal;