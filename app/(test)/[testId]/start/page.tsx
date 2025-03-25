// my name is Archit

'use client';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/Heading';
import { Separator } from '@/components/ui/separator';
import React, { useState, useEffect } from 'react';
import Proctor from '../../Proctor';
import { useParams, useRouter } from 'next/navigation';
import Modals from '../../components/Modals';
import { api } from "../../../../convex/_generated/api"
import { useQuery, useMutation } from "convex/react";
import Loader from '@/components/ui/Loader';
import { useLoader } from '@/app/LoaderContext';
import { useAuth } from '@clerk/clerk-react';

const TestPage = () => {
    const { userId } = useAuth();
    const { testId } = useParams() as {testId : string};
    const testIdString = Array.isArray(testId) ? testId[0] : testId;
    const test = useQuery(api.GetTest.getTestById, { testId: testIdString as string });
    const pushTestAnswer = useMutation(api.pushAnswer.push_test_answer);
    const UpdateTotalInteraction = useMutation(api.TotalInteractions.Push_totalInteractions);
    const UpdateDailyInteraction = useMutation(api.DailyInteractions.Push_TodayInteraction);

    const jobTitle = useQuery(api.FindTest.getJTbyTestId, { testId: testIdString as string }) || '';
    console.log(jobTitle);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [showExitModal, setShowExitModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { showLoader, hideLoader } = useLoader();
    const [routeId, setRouteId] = useState<string | null>(null);

    const router = useRouter();

    if (!userId) {
        router.push("/");
    }

    useEffect(() => {
        showLoader();
        if (test && test.QuestionSet) {
            setIsLoading(false);
            setSelectedAnswers(new Array(test.QuestionSet.length).fill(-1));
            hideLoader();
        }
    }, [test]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            clearInterval(timer);
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const handlePopState = (event: any) => {
        event.preventDefault();
        setShowExitModal(true);
        window.history.pushState(null, '', window.location.href);
    };

    const handleExitConfirm = () => {
        setShowExitModal(false);
        router.push('/exploreTest');
    };

    const handleExitCancel = () => {
        setShowExitModal(false);
    };

    const handleOptionChange = (index: number) => {
        const updatedAnswers = [...selectedAnswers];
        updatedAnswers[currentQuestion] = index;
        setSelectedAnswers(updatedAnswers);
    };

    const handleQuestionClick = (index: number) => {
        setCurrentQuestion(index);
    };

    const handleSubmit = async () => {
        showLoader();
        if (!test || !test.QuestionSet) {
            console.error("Test data is not available");
            return;
        }
        if (!userId) {
            console.error("UserId is not available");
            return;
        }
        if(!jobTitle){
            console.error("JobTitle is not available");
            return;
        }

        const answerSet = test.QuestionSet.map((question: any, index: any) => ({
            question: question.question,
            userAnswer: question.options[selectedAnswers[index]] || "",
            correctAnswer: question.options[parseInt(question.answer) - 1] || "",
            providedOptions: question.options
        }));

        try {
            const answerId = await pushTestAnswer({
                userId: userId,
                testId: testIdString,
                jobTitle:jobTitle,
                answerSet: answerSet
            });

            console.log(answerId);

            if (answerId) {
                const TotalInteractionId = await UpdateTotalInteraction({ userId: userId })
                console.log("TotalInteractions : ", TotalInteractionId);
                const DailyInteractionId = await UpdateDailyInteraction({ userId: userId })
                console.log("DailyInteractionId : ", DailyInteractionId);

                setRouteId(answerId);
            }
        } catch (error) {
            console.error("Error submitting test:", error);
        }
    };

    useEffect(() => {
        if (routeId != null) {
            router.push(`/${testId}/start/${routeId}`);
        }
    }, [routeId])

    const handleAutoSubmit = () => {
        alert("Test is being auto-submitted due to tab changes.");
        handleSubmit();
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    if (isLoading) {
        return <Loader />;
    }

    const currentQuestionData = test?.QuestionSet[currentQuestion];

    return (
        <Proctor onAutoSubmit={handleAutoSubmit}>
            
            <div className="flex flex-col h-screen w-screen overflow-hidden">
                <div className="relative w-full bg-[#4c2195] text-white p-4 flex justify-between items-center">
                    <Heading >Test</Heading>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg w-32 h-16 flex justify-center items-center">
                        <span className="font-mono text-black text-lg">
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                    <Button size={'sm'} variant={'destructive'} onClick={handleSubmit}>Submit Test</Button>
                </div>
                <Separator />
                <div className="flex-grow overflow-auto">
                    <div className='flex flex-row items-start justify-between pt-5 gap-5 h-[70%]'>
                        <div className="bg-slate-200 h-full w-[60%] p-20 rounded-xl">
                            <div className="question-side">
                                <h2 className='font-bold text-2xl pb-5'>{`Question ${currentQuestion + 1}: ${currentQuestionData?.question}`}</h2>
                                {currentQuestionData?.options.map((option: any, index: any) => (
                                    <div className='flex items-center gap-4 pb-2' key={index}>
                                    <input
                                        type="radio"
                                        name="option"
                                        checked={selectedAnswers[currentQuestion] === index}
                                        onChange={() => handleOptionChange(index)}
                                        className='w-6 h-6'
                                    />
                                    <label className='text-lg ml-2'>
                                        {option}
                                    </label>
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className='bg-slate-200 h-full w-[40%] rounded-xl'>
                            <div className="p-20 grid gap-8 grid-cols-4">
                                {test?.QuestionSet.map((_: any, index: any) => {
                                    const isSelected = selectedAnswers[index] !== -1;
                                    const isActive = currentQuestion === index;
                                    const buttonColor = isActive
                                        ? 'bg-[#7C3AED]'
                                        : isSelected
                                            ? 'bg-[#E9D5FF]'
                                            : 'bg-gray-400';

                                    return (
                                        <button
                                            key={index}
                                            className={`h-10 w-10 rounded-lg ${buttonColor}`}
                                            onClick={() => handleQuestionClick(index)}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className='pt-10'>
                        <Separator />
                        <div className="flex flex-row items-center justify-between px-20 py-4">
                            <Button
                                onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
                                disabled={currentQuestion === 0}
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={() => setCurrentQuestion((prev) => Math.min(prev + 1, (test?.QuestionSet?.length ?? 0) - 1))}
                                disabled={currentQuestion === (test?.QuestionSet?.length ?? 0) - 1}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="w-full bg-[#4c2195] text-white p-3 flex justify-center items-center mt-auto">
                    <p className="text-sm font-bold">© Lucid , All Rights Reserved</p>
                </div>
            </div>

            {showExitModal && (
                <Modals head='Exit Test' alert='Are you sure you want to exit the test? Your progress will be lost.' action={handleExitConfirm} button='Exit' />
            )}
            <Loader />
        </Proctor>
    );
};

export default TestPage;