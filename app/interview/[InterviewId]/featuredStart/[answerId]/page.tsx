"use client"
import React, { useEffect } from 'react'
import { useQuery } from 'convex/react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/convex/_generated/api'
import { useLoader } from '@/app/LoaderContext'
import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/button'
import { RotateCcw, MoveLeft } from 'lucide-react'

const Result = () => {
    const { answerId } = useParams() as { answerId: string };
    const { showLoader, hideLoader } = useLoader();
    const router = useRouter();

    const userResponse = useQuery(api.GetInterviewAnswer.get_userAnswer, {
        answerId: answerId as string,
    });

    useEffect(() => {
        if (answerId) {
            showLoader();
        }
        if (userResponse) {
            hideLoader();
        }
    }, [answerId, userResponse, showLoader, hideLoader]);

    if (!userResponse) {
        return <Loader />;
    }

    const analytics = userResponse.analytics[0];

    return (
        <div className="flex flex-col min-h-screen w-full gap-8 bg-gray-100 py-10 px-5 md:px-10">
            <div className='flex items-center justify-between'>
                <Button className='flex gap-2' onClick={() => router.push('/exploreInterview')}> <MoveLeft />Back </Button>
                <Button className='flex gap-2' onClick={() => router.back()}>Retest <RotateCcw /></Button>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg">
                <h1 className="text-4xl font-bold text-[#7C3AED] mb-6">Result Analysis</h1>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">Score</h2>
                    <p className="text-5xl font-bold text-[#7C3AED]">{analytics?.score}/100</p>
                </div>

                {analytics?.strength && analytics.strength.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Strengths</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            {analytics.strength.map((item, index) => (
                                <li key={index} className="text-gray-700">{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {analytics?.weakness && analytics.weakness.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Areas for Improvement</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            {analytics.weakness.map((item, index) => (
                                <li key={index} className="text-gray-700">{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {analytics?.summary && (
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Summary</h2>
                        <p className="text-gray-700">{analytics.summary}</p>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg mt-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">Interview Details</h2>
                <p><strong>Job Title:</strong> {userResponse.jobTitle}</p>
                <p><strong>Date:</strong> {new Date(userResponse.date).toLocaleString()}</p>
            </div>
        </div>
    )
}

export default Result