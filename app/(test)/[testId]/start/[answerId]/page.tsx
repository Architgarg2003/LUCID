


"use client"
import Meter from '@/components/Meter'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'convex/react'
import { useParams } from 'next/navigation'
import { api } from '@/convex/_generated/api'
import { useLoader } from '@/app/LoaderContext'
import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/button'
import { RotateCcw, MoveLeft } from 'lucide-react';
import { useRouter } from 'next/navigation'
import { useMutation } from 'convex/react'
import { useAuth } from '@clerk/clerk-react'

const Result = () => {
    const { answerId } = useParams() as { answerId: string };;
    const [response, setResponse] = useState<any>();
    const { showLoader, hideLoader } = useLoader();

    const {userId} = useAuth();

    const updateLeaderboard = useMutation(api.LeaderBoard.updateLeaderboard);

    // This will directly get the user response from the API
    const userResponse = useQuery(api.GetUserAnswer.get_userAnswer, {
        answerId: answerId as string,
    });
    

    // Log the response whenever it changes
    useEffect(() => {
        console.log("userResponse", userResponse);
        if (userResponse) {
            setResponse(userResponse);
        }
    }, [userResponse]);

    // Showing and hiding loader based on the presence of userResponse
    useEffect(() => {
        if (answerId) {
            showLoader();
        }
        if (response) {
            hideLoader();
        }
    }, [answerId, response, showLoader, hideLoader]);

    // Calculate metrics
    const calculateMetrics = () => {
        if (!response || !response.answerSet || !userId) {
            return { attempted: 0, correct: 0, score: 0, percentage: 0 };
        }

        const attempted = response.answerSet.length;
        const correct = response.answerSet.filter((answer: any) => answer.userAnswer === answer.correctAnswer).length;
        const score = (correct / attempted) * 100;
        const percentage = Math.round(score);

        // updateLeaderboard({ userId, additionalPoints: score, additionalAccuracy: percentage });

        return { attempted, correct, score, percentage };
    }

    const { attempted, correct, score, percentage } = calculateMetrics();

    useEffect(() => {
        if ( userId && score && percentage) {
            const updateLeaderboardAsync = async () => {
                try {
                    const x = await updateLeaderboard({ userId:userId, additionalPoints: score, additionalAccuracy: percentage });
                    console.log("Leaderboard updated successfully :", x);
                } catch (error) {
                    console.error("Error updating leaderboard:", error);
                }
            };

            updateLeaderboardAsync();
        }
    }, [userId, score, percentage]);


    // Function to determine the background color of the question card
    const getCardBackgroundColor = (question: any) => {
        if (!question.userAnswer) return 'bg-white'; // Not answered
        return question.userAnswer === question.correctAnswer ? 'bg-green-100' : 'bg-red-100';
    }

    const router = useRouter();

    return (
        <div className="flex flex-col min-h-screen justify-center w-full gap-8 bg-gray-100 py-10">
            {/* First row with two boxes */}
            <div className='px-10 flex items-center justify-between'>
                <Button className='flex gap-2' onClick={()=>router.push('/')}> <MoveLeft />Back </Button>
                <Button className='flex gap-2' onClick={() => router.back()}>Retest <RotateCcw /></Button>
            </div>
            <div className="flex flex-col md:flex-row w-full justify-center space-x-0 md:space-x-5 space-y-5 md:space-y-0">
                {/* Left card with smaller cards inside */}
               
               
                <div className="flex flex-col rounded-3xl w-full md:w-[47%] h-72 bg-[#7C3AED] pt-9 p-5">
                    {/* Row with two small cards */}
                    <div className="flex flex-row justify-between mb-4">
                        <div className="flex flex-col w-[48%] h-32 bg-gray-100 rounded-xl items-center justify-center p-2">
                            <p className="text-sm font-semibold text-black">Questions Attempted</p>
                            <p className="text-2xl font-bold text-black">{attempted}</p>
                        </div>
                        <div className="flex flex-col w-[48%] h-32 bg-gray-100 rounded-xl items-center justify-center p-2">
                            <p className="text-sm font-semibold text-black">Solved Correctly</p>
                            <p className="text-2xl font-bold text-black">{correct}</p>
                        </div>
                    </div>

                    {/* Single card below the two small cards */}
                    <div className="flex w-full h-32 bg-gray-100 rounded-xl items-center justify-center p-2">
                        <div className="text-center">
                            <p className="text-sm font-semibold text-black">Score</p>
                            <p className="text-2xl font-bold text-black">{score.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Right empty card */}
                <div className="flex items-center justify-center rounded-3xl w-full md:w-[47%] h-72 bg-white mt-9">
                    <Meter percentage={percentage} size={400} strokeWidth={50} />
                    <div className='absolute pt-32'>
                        <h1 className='font-bold text-5xl'>{percentage}%</h1>
                    </div>
                </div>
            </div>

            <h1 className="text-4xl font-bold text-black text-start ml-10">Detailed Analysis</h1>

            {/* Question cards */}
            <div className="flex flex-col w-full items-center space-y-5">
                {response && response.answerSet && response.answerSet.map((question: any, index: number) => (
                    <div key={index} className={`flex flex-col rounded-3xl w-[96%] h-auto p-5 ${getCardBackgroundColor(question)}`}>
                        <p className="font-semibold mb-2 text-black">Question {index + 1}: {question.question}</p>
                        <div className="flex flex-col space-y-2 text-black">
                            {question.providedOptions.map((option: string, optionIndex: number) => (
                                <label key={optionIndex} className="flex items-center">
                                    <input
                                        type="radio"
                                        name={`question${index}`}
                                        value={option}
                                        checked={option === question.userAnswer}
                                        readOnly
                                    />
                                    <span className={`ml-2 ${option === question.correctAnswer ? 'font-bold' : ''}`}>
                                        {option} {option === question.correctAnswer ? '(Correct Answer)' : ''}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {question.userAnswer !== question.correctAnswer && (
                            <p className="mt-2 text-red-500">Your answer: {question.userAnswer || 'Not answered'}</p>
                        )}
                    </div>
                ))}
            </div>
            <Loader />
        </div>
    )
}

export default Result
