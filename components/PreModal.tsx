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


interface PreModalI {
    companyName?: string;
    jobTitle?: string;
    tags?: string[];
    testId?: string;
    InterviewId?:string;
    isInterview?:boolean
}



const PreModal = ({ companyName, jobTitle, tags, testId, InterviewId, isInterview }: PreModalI) => {
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

    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
    };

    if (isMobile) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <div className="bg-[#141414] rounded-full text-white px-3 py-1 cursor-pointer">
                        Details
                    </div>
                </DialogTrigger>
                <DialogContent className="w-[90%] max-w-[400px] p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold mb-4 flex items-center">
                            {/* <AlertCircle className="w-6 h-6 mr-2 text-yellow-500" /> */}
                            Device Compatibility
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-center text-gray-700 mb-4">
                        For the best experience, please use a laptop or desktop computer to take this test.
                    </p>
                    
                </DialogContent>
            </Dialog>
        );
    }


    return (
      
        <Dialog>
      <DialogTrigger asChild>
        <div className="bg-[#141414] rounded-full text-white px-3 py-1 cursor-pointer">
          Details
        </div>
      </DialogTrigger>
      <DialogContent className="h-max w-[90rem]">
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
                <TableCell className="font-medium">
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
            onClick={() => {
              isInterview
                ? router.push(`interview/${InterviewId}/start`)
                : router.push(`/${testId}/start`);
            }}
          >
            Start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    )
}

export default PreModal;