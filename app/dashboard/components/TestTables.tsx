"use client"

import * as React from "react"
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface TestTablesI{
    UserTestHistory:any;
    UserInterviewHistory:any
}

export function TestTables({ UserTestHistory,UserInterviewHistory }: TestTablesI) {

    const router = useRouter();

    const formatDate = (isoDate: string): string => {
        try {
            // Parse the ISO 8601 formatted date string
            const dateObj = new Date(isoDate);

            // Format the date to a human-readable format
            return format(dateObj, 'yyyy-MM-dd');
        } catch (error) {
            console.error('Error parsing date:', error);
            return 'Invalid date';
        }
    };
    
    return (
        <div>
            <div className="w-full pt-5">
                <p className="p-1 font-bold text-xl">Test</p>

                <div className="rounded-md border overflow-hidden overflow-y-scroll h-[23rem]">
                    <div className="relative overflow-x-auto ">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Job Title
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <span className="sr-only">Analysis</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {UserTestHistory?.map((item: any, index: any) => (
                                    <tr key={index} className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${index === UserTestHistory.length - 1 ? '' : 'border-b'}`}>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {item.jobTitle}
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatDate(item.date)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button onClick={() => router.push(`dashboard/Analysis/${item._id}`)} size={'sm'} className="font-normal text-white ">Analysis</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            {/*  */}
            <div className="w-full pt-5">
                <p className="p-1 font-bold text-xl">Interview</p>

                <div className="rounded-md border overflow-hidden overflow-y-scroll h-[23rem]">
                    <div className="relative overflow-x-auto ">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Job Title
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <span className="sr-only">Analysis</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {UserInterviewHistory?.map((item: any, index: any) => (
                                    <tr key={index} className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${index === UserTestHistory.length - 1 ? '' : 'border-b'}`}>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {item.jobTitle}
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatDate(item.date)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button onClick={() => router.push(`dashboard/InterviewAnalysis/${item._id}`)} size={'sm'} className="font-normal text-white ">Analysis</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
        
    )
}
