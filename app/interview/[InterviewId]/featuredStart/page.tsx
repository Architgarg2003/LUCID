"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAction, useMutation, useQuery } from "convex/react";
import { useParams } from 'next/navigation';
import TextToSpeech from "../../components/textToSpeech";
import Dictaphone from "../../components/speechRecognition";
import { api } from "@/convex/_generated/api";
import { Separator } from '@/components/ui/separator';
import Proctor from '../../Proctor';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/clerk-react';
// import Loader from '@/components/ui/Loader';
import { useLoader } from '@/app/LoaderContext';
import { useRouter } from 'next/navigation';

import dynamic from 'next/dynamic';
const Loader = dynamic(() => import('@/components/ui/Loader'), { ssr: false });


interface Answer {
    question: string;
    userAnswer: string;
}

const FloatingVideo: React.FC<{ videoStream: MediaStream | null }> = ({ videoStream }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (videoRef.current && videoStream) {
            videoRef.current.srcObject = videoStream;
        }
    }, [videoStream]);

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="w-48 h-36 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

const InterviewPage: React.FC = () => {

    const { userId } = useAuth() as { userId: string };
    const { InterviewId } = useParams() as { InterviewId: string };
    const testIdString = Array.isArray(InterviewId) ? InterviewId[0] : InterviewId;
    const test = useQuery(api.GetInterview.getFInterviewById, { InterviewId: testIdString });
    const Analysis = useAction(api.InterviewAnalytics.createAnalytics);

    const [isLoading, setIsLoading] = useState(true);
    const { showLoader, hideLoader } = useLoader();
    const [routeId, setRouteId] = useState<string | null>(null);

    const router = useRouter();

    const pushResult = useMutation(api.pushInterviewAnswer.push_interview_answer);

    const UpdateTotalInteraction = useMutation(api.TotalInteractions.Push_totalInteractions);
    const UpdateDailyInteraction = useMutation(api.DailyInteractions.Push_TodayInteraction);
    const updateLeaderboard = useMutation(api.LeaderBoard.updateLeaderboard);


    const jobTitle = useQuery(api.FindInterview.getInterviewFJTbyTestId,{InterviewId:InterviewId});
    console.log("jobTitle", jobTitle);
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

    const startVideoStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setVideoStream(stream);
            console.log("Video stream started successfully");
        } catch (err) {
            console.error("Error accessing video stream:", err);
        }
    };

    const stopVideoStream = useCallback(() => {
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            setVideoStream(null);
            console.log("Video stream stopped");
        }
    }, [videoStream]);


    useEffect(() => {
        showLoader();
        if (test && test.QuestionSet) {
            setIsLoading(false);
            hideLoader();
        }
    }, [test]);

    useEffect(() => {
        return () => {
            stopVideoStream();
        };
    }, [stopVideoStream]);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [timer, setTimer] = useState(30);
    const [isInterviewComplete, setIsInterviewComplete] = useState(false);
    const [isInterviewStarted, setIsInterviewStarted] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [currentTranscript, setCurrentTranscript] = useState('');
    const [isTimerEnded, setIsTimerEnded] = useState(false);

    const questions = test?.QuestionSet || [];
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const transitionRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isInterviewStarted && currentQuestionIndex >= 0 && currentQuestionIndex < questions.length && !isInterviewComplete && !isTransitioning) {
            const speakingDelay = setTimeout(() => {
                setIsSpeaking(true);
            }, 2000);

            return () => clearTimeout(speakingDelay);
        }
    }, [currentQuestionIndex, questions, isInterviewComplete, isInterviewStarted, isTransitioning]);

    const handleSpeechEnd = () => {
        setIsSpeaking(false);
        setIsListening(true);
        startTimer();
    };

    const startTimer = () => {
        setTimer(30);
        setIsTimerEnded(false);
        timerRef.current = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(timerRef.current!);
                    handleTimerEnd();
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
    };

    const handleTimerEnd = () => {
        setIsListening(false);
        setIsTimerEnded(true);
    };

    const handleTranscriptUpdate = useCallback((transcript: string) => {
        setCurrentTranscript(transcript);
    }, []);

    const saveAnswerAndMoveNext = () => {
        const newAnswer: Answer = {
            question: questions[currentQuestionIndex].question,
            userAnswer: currentTranscript
        };

        setAnswers(prev => {
            const updatedAnswers = [...prev];
            updatedAnswers[currentQuestionIndex] = newAnswer;
            return updatedAnswers;
        });

        if (currentQuestionIndex < questions.length - 1) {
            moveToNextQuestion();
        } else {
            saveLastAnswerAndComplete();
        }
    };

    const moveToNextQuestion = () => {
        setIsTransitioning(true);
        setCurrentTranscript('');
        setIsTimerEnded(false);

        transitionRef.current = setTimeout(() => {
            setIsTransitioning(false);
            setCurrentQuestionIndex(prev => prev + 1);
        }, 2000);
    };

    const saveLastAnswerAndComplete = async () => {
        showLoader();
        try {
            const updatedAnswers = [...answers, {
                question: questions[currentQuestionIndex].question,
                userAnswer: currentTranscript
            }];

            const fullAnswers = questions.map((q, index) => ({
                question: q.question,
                userAnswer: updatedAnswers[index]?.userAnswer || ''
            }));

            console.log("Interview Completed", fullAnswers);

            const analytics = await Analysis({ answerSet: fullAnswers });
            console.log("Analytics Data", analytics);

            if(jobTitle && analytics){
                const feedResult = await pushResult({
                    userId: userId || '', // Provide a default value
                    InterviewId: InterviewId || '', // Provide a default value
                    jobTitle: jobTitle || '', // Ensure jobTitle is defined
                    analytics: analytics,
                    answerSet: fullAnswers
                })
                console.log("feedResult", feedResult);
                // setRouteId(feedResult);

                if (feedResult) {
                    const TotalInteractionId = await UpdateTotalInteraction({ userId: userId })
                    console.log("TotalInteractions : ", TotalInteractionId);
                    const DailyInteractionId = await UpdateDailyInteraction({ userId: userId })
                    console.log("DailyInteractionId : ", DailyInteractionId);

                    const x = await updateLeaderboard({ userId: userId, additionalPoints: analytics && Number(analytics[0].score), additionalAccuracy: 0 });
                    console.log('Leaderboard Updated ',x)

                    setRouteId(feedResult);
                }
            }
           
            setIsInterviewComplete(true);

        } catch (error) {
            console.error("Error during interview completion:", error);
        }finally{
            hideLoader();
        }
    };

    const startInterview = () => {
        setIsInterviewStarted(true);
        setCurrentQuestionIndex(0);
        startVideoStream();
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (transitionRef.current) clearTimeout(transitionRef.current);
        };
    }, []);


    return (
        <Proctor>
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <div className="relative w-full bg-[#4c2195] text-white p-4 flex justify-between items-center">
                    <h1 className='text-white font-bold text-xl'>Interview</h1>
                </div>
                <Separator />

                {isInterviewStarted && <FloatingVideo videoStream={videoStream} />}

                <main className="flex-grow flex flex-col items-center justify-center p-4">
                    {!isInterviewStarted ? (
                        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                            <h2 className="text-2xl font-semibold mb-4">Welcome to Your Virtual Interview</h2>
                            <p className="mb-6">When you're ready to begin, click the button below.</p>
                            <button
                                onClick={startInterview}
                                className="bg-[#7C3AED] hover:bg-[#7430ea] text-white font-bold py-2 px-4 rounded transition duration-300"
                            >
                                Start Your Interview
                            </button>
                        </div>
                    ) : !isInterviewComplete ? (
                        <div className="w-full max-w-4xl">
                            {isTransitioning ? (
                                <div className="text-center py-8">
                                    <p className="text-xl">Moving to the next question...</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold mb-2">Question {currentQuestionIndex + 1}</h2>
                                        <h3 className="text-lg">{questions[currentQuestionIndex].question}</h3>
                                        <TextToSpeech
                                            text={questions[currentQuestionIndex].question}
                                            autoSpeak={isSpeaking}
                                            onSpeechEnd={handleSpeechEnd}
                                        />
                                    </div>

                                    <div className="flex-1">
                                        {isSpeaking ? (
                                            <p className="text-gray-600">Please listen to the question...</p>
                                        ) : (
                                            <>
                                                <p className="mb-2">Time remaining: <span className="font-semibold">{timer} seconds</span></p>
                                                <Dictaphone onTranscriptUpdate={handleTranscriptUpdate} isListening={isListening} />
                                                {isTimerEnded && (
                                                    <button
                                                        onClick={saveAnswerAndMoveNext}
                                                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                                                    >
                                                        Next Question
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                            <h2 className="text-2xl font-semibold mb-4">Interview Complete</h2>
                            <p>Thank you for your responses. Your answers have been recorded.</p>
                            <Button onClick={()=>{showLoader(); router.push(`/interview/${InterviewId}/featuredStart/${routeId}`)}} className='mt-10' size={'default'} variant={'default'}>View Result</Button>
                        </div>
                    )}
                </main>

                <div className="w-full bg-[#4c2195] text-white p-3 flex justify-center items-center mt-auto">
                    <p className="text-sm font-bold">© Lucid, All Rights Reserved</p>
                </div>
            </div>
            <Loader />
        </Proctor>
    );
};

export default InterviewPage;