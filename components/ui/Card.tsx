"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { FaStar } from "react-icons/fa";
import { Badge } from "./Badge";
import dynamic from 'next/dynamic';
import PreModal from "../PreModal";
import { TiStarOutline } from "react-icons/ti";
import { TiStarFullOutline } from "react-icons/ti";
import { motion, AnimatePresence } from 'framer-motion';
import FPreModal from "../FPremodal";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { api } from "@/convex/_generated/api";
import { useMutation,useQuery } from "convex/react";
import { useAuth } from "@clerk/clerk-react";

const Toggle = dynamic(() => import('./Toggle').then((mod) => mod.Toggle), { ssr: false });
const Button = dynamic(() => import('./button').then((mod) => mod.Button), { ssr: false });

interface CardsI{
    data:any;
    isInterview?:boolean;
}

export default function Cards({ data, isInterview }: CardsI) {
    const colors = ["#d8b4fe", "#e9d5ff", "#c4b5fd", "#ddd6fe", "#f5d0fe"];
    const list = [{ title: "Orange" }];

    console.log(data);

    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

    // const [isStarred, setIsStarred] = useState(false);
    // const [starCount, setStarCount] = useState();

    const { userId } = useAuth() as { userId: string };


    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);


    const addLike = useMutation(api.UserLike.AddLike);
    const removeLike = useMutation(api.UserLike.RemoveLike);
    const increaseLike = useMutation(api.LikeCount.increaseLikeCount);
    const decreaseLike = useMutation(api.LikeCount.decreaseLikeCount);

    const cardId = data?._id;

    const checkLike = useQuery(api.UserLike.AlreadyLiked, { userId, cardId });
    const getLike = useQuery(api.LikeCount.getLikeCount, { cardId });


    useEffect(() => {
        if (checkLike == true) {
            setIsLiked(checkLike);
        }
        else {
            setIsLiked(false)
        }
    }, [checkLike]);

    useEffect(() => {
        if (getLike !== undefined) {
            setLikeCount(getLike);
        }
    }, [getLike]);


    const handleLikeToggle = async () => {
        if (isLiked) {
            await removeLike({ userId, cardId });
            await decreaseLike({ cardId });
        } else {
            await addLike({ userId, cardId });
            await increaseLike({ cardId });
        }
        setIsLiked(!isLiked);
        // Update the like count directly after the mutation
        setLikeCount((prevCount) => isLiked ? prevCount - 1 : prevCount + 1);
    };

    const starVariants = {
        active: {
            scale: [1, 1.2, 0.9, 1.1, 1],
            rotate: [0, -15, 15, -15, 0],
            transition: {
                duration: 0.5,
                ease: "easeInOut",
            },
        },
        inactive: {
            scale: 1,
            rotate: 0,
            transition: {
                duration: 0.2,
            },
        },
    };



    return (
        // <div className="overflow-x-auto whitespace-nowrap">
        //     <div className="inline-flex space-x-4">
        //         {list.map((item, index) => (
        //             <Card
        //                 shadow="sm"
        //                 key={index}
        //                 isPressable
        //                 className="w-80 rounded-2xl border border-gray-400"
        //             >
        //                 <CardBody className="overflow-y-auto p-2 bg-white rounded-t-2xl w-full max-h-[18rem]">
        //                     <div style={{ backgroundColor: getRandomColor() }} className="relative w-full h-[15rem] rounded-xl">
        //                         <div className="flex flex-row items-center justify-between p-3">
        //                             <div>
        //                                 <Badge className="bg-white rounded-full" variant="outline">{data?.difficultyLevel}</Badge>
        //                             </div>
        //                             <div>
        //                                 {/* <Toggle variant="outline" className="bg-white">
        //                                    69 <FaStar className="text-gray-500 data-[state=on]:text-[hsl(271.5,81.3%,55.9%)]" />
        //                                 </Toggle> */}

        //                                 <Toggle 
        //                                     variant="outline" 
        //                                     aria-label="Toggle star" 
        //                                     className="bg-white"
        //                                     pressed={isLiked}

        //                                     onPressedChange={handleLikeToggle}
        //                                 >
        //                                     <AnimatePresence mode="wait">
        //                                         <motion.div
        //                                             key={isLiked ? 'starred' : 'unstarred'}
        //                                             initial={{ scale: 1 }}
        //                                             animate={isLiked ? 'active' : 'inactive'}
        //                                             variants={starVariants}
        //                                             style={{ display: 'inline-block' }}
        //                                         >
        //                                             {isLiked ? (
        //                                                 <AiFillHeart className="text-purple-500 h-5 w-5" />
        //                                             ) : (
        //                                                 <AiOutlineHeart className="text-black h-5 w-5" />
        //                                             )}
        //                                         </motion.div>
        //                                     </AnimatePresence>
        //                                     <span className="p-1">{likeCount}</span>
        //                                 </Toggle>
        //                             </div>
        //                         </div>
        //                         <div className="flex flex-col items-start text-left pt-3 pl-4 max-w-full">
        //                             <p className="text-md font-semibold">{data?.companyName}</p>
        //                             <h1 className="text-2xl font-bold break-words overflow-hidden text-wrap">{data?.jobTitle}</h1>
        //                         </div>
        //                         <div className="flex flex-row items-start gap-3 flex-wrap pt-3 pl-4">
        //                             {data?.tags.map((tag:any,index:any)=>(
        //                                 <Badge key={index} size={'sm'} className="border-gray-400 text-sm rounded-full" variant="outline">{tag}</Badge>
        //                             ))}
        //                         </div>
        //                     </div>
        //                 </CardBody>
        //                 <CardFooter className="text-small justify-between bg-white rounded-b-2xl">
        //                     {/* <b>{item.title}</b> */}

        //                     {/* <Button className="bg-[#141414] rounded-full text-white w-1/4 p-3" size="sm">
        //                         Details
        //                     </Button> */}
        //                     <FPreModal jobTitle={data?.jobTitle} companyName={data?.companyName} tags={data?.tags} testId={data.testId} interviewId={data?.InterviewId} isInterview={isInterview} />
        //                 </CardFooter>
        //             </Card>
        //         ))}
        //     </div>
        // </div>

        <div className="overflow-x-auto whitespace-nowrap">
            <div className="inline-flex space-x-4">
                {list.map((item, index) => (
                    <Card
                        shadow="sm"
                        key={index}
                        isPressable
                        className="w-80 rounded-2xl border border-gray-400"
                    >
                        <CardBody className="overflow-y-auto p-2 bg-white rounded-t-2xl w-full max-h-[18rem]">
                            <div style={{ backgroundColor: getRandomColor() }} className="relative w-full h-[15rem] rounded-xl">
                                <div className="flex flex-row items-center justify-between p-3">
                                    <div>
                                        <Badge className="bg-white rounded-full" variant="outline">{data?.difficultyLevel}</Badge>
                                    </div>
                                    <div>
                                        <Toggle
                                            variant="outline"
                                            aria-label="Toggle star"
                                            className="bg-white"
                                            pressed={isLiked}
                                            onPressedChange={handleLikeToggle}
                                        >
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={isLiked ? 'starred' : 'unstarred'}
                                                    initial={{ scale: 1 }}
                                                    animate={isLiked ? 'active' : 'inactive'}
                                                    variants={starVariants}
                                                    style={{ display: 'inline-block' }}
                                                >
                                                    {isLiked ? (
                                                        <AiFillHeart className="text-purple-500 h-5 w-5" />
                                                    ) : (
                                                        <AiOutlineHeart className="text-black h-5 w-5" />
                                                    )}
                                                </motion.div>
                                            </AnimatePresence>
                                            <span className="p-1">{likeCount}</span>
                                        </Toggle>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start text-left pt-3 pl-4 max-w-full">
                                    {/* Responsive text size */}
                                    <p className="text-sm sm:text-base md:text-lg font-semibold">{data?.companyName}</p>
                                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold break-words overflow-hidden text-wrap">{data?.jobTitle}</h1>
                                </div>
                                <div className="flex flex-row items-start gap-3 flex-wrap pt-3 pl-4">
                                    {data?.tags.map((tag: any, index: any) => (
                                        <Badge key={index} size={'sm'} className="border-gray-400 text-xs sm:text-sm md:text-base rounded-full" variant="outline">{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                        </CardBody>
                        <CardFooter className="text-small justify-between bg-white rounded-b-2xl">
                            <FPreModal
                                jobTitle={data?.jobTitle}
                                companyName={data?.companyName}
                                tags={data?.tags}
                                testId={data.testId}
                                interviewId={data?.InterviewId}
                                isInterview={isInterview}
                            />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>

    );
}