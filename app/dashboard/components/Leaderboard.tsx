"use client"
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface LeaderBoardI{
    TopUsers:any;
}

export function Leaderboard({ TopUsers }:LeaderBoardI) {

    return (
        <div className="w-full">
            <div className="flex w-full items-center py-4">
                <div className="relative w-full overflow-x-auto sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-black uppercase dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                                    Rank
                                </th>
                                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Score
                                </th>
                            </tr>
                        </thead>
                        <tbody>

                            {TopUsers?.map((user:any, index:any) => (
                                <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                        {index+1}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.totalPoints.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
           
            </div>
    )
}
