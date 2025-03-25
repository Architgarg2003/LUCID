
"use client";

import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from 'react';
import { Separator } from "@/components/ui/separator";
// import GitMap from "./components/Heatmap";
import Header from "./components/Header";
// import Meter from "./components/Meter";
import { TestTables } from "./components/TestTables";
import { Leaderboard } from "./components/Leaderboard";
import Heading from "@/components/ui/Heading";
import { useMutation, useQueries, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useLoader } from "../LoaderContext";
// import Loader from "@/components/ui/Loader";


import dynamic from 'next/dynamic';
import Modal from "@/components/ui/FileModal";

const Loader = dynamic(() => import('@/components/ui/Loader'), { ssr: false });
const Meter = dynamic(() => import('./components/Meter'), { ssr: false });
const GitMap = dynamic(() => import('./components/Heatmap'), { ssr: false });

const Dashboard = () => {
  const { userId } = useAuth();

  const TotalInteractions = useQuery(api.TotalInteractions.Get_TotalInteraction, { userId: userId || "" });
  console.log("TotalInteractions", TotalInteractions);

  const DailyInteraction = useQuery(api.DailyInteractions.Get_AllUserInteractions, { userId: userId || "" });
  console.log("DailyInteraction", DailyInteraction);

  const getUserLeaderboardData = useQuery(api.LeaderBoard.getUserLeaderboardData, { userId: userId || "" });
  console.log("getUserLeaderboardData", getUserLeaderboardData);

  const TopUsers = useQuery(api.LeaderBoard.getTopUsers);
  console.log("TopUsers", TopUsers);

  const AllUsers = useQuery(api.LeaderBoard.getAllUsers);
  console.log("AllUsers", AllUsers);

  const UserTestHistory = useQuery(api.GetHistory.getTestHistoryById, { userId: userId || '' });
  console.log("UserTestHistory", UserTestHistory);

  const UserInterviewHistory = useQuery(api.GetHistory.getInterviewHistoryById, { userId: userId || '' });
  console.log("UserTestHistory", UserTestHistory);

  const ResumeFiles = useQuery(api.fetchFiles.FetchResumeFiles, { userId: userId || '' })
  console.log("FetchResumeFiles : ", ResumeFiles)

  const generateUploadUrl = useMutation(api.uploadPdF.generateUploadUrl)
  const saveFile = useMutation(api.uploadPdF.saveFile)


  const percentage = getUserLeaderboardData?.totalAccuracy;

  const { showLoader, hideLoader } = useLoader();
  const [rank, setRank] = useState<number>();
  const [dailyStreak, setDailyStreak] = useState<number>();
  const [maxStreak, setMaxStreak] = useState<number>();

  //
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = async (uploadedFiles:any) => {
    console.log("uploadedFiles",uploadedFiles);
    if (uploadedFiles) {
        try {
          const postUrl = await generateUploadUrl()
          const result = await fetch(postUrl, {
            method: 'POST',
            headers: { 'Content-Type': uploadedFiles.type },
            body: uploadedFiles,
          })
          const { storageId } = await result.json();
          await saveFile({ storageId, userId:userId || '', fileName: uploadedFiles.name, fileType: uploadedFiles.type })
      } catch (error) {
        console.error("Error parsing PDF:", error)
      }
    }
  }

  const handleModalOpen = ()=>{
     setIsModalOpen(true)
  }
// 
  useEffect(() => {
    if (!TotalInteractions && !DailyInteraction && !getUserLeaderboardData && !TopUsers) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [TotalInteractions, DailyInteraction, getUserLeaderboardData, TopUsers, showLoader, hideLoader]);

  useEffect(() => {
    if (Array.isArray(AllUsers)) {
      const calculateUserRank = () => {
        const userIndex = AllUsers.findIndex(entry => entry.userId === userId);
        if (userIndex === -1) {
          console.error("User not found in the leaderboard");
          return;
        }
        console.log("UserRank", userIndex + 1);
        setRank(userIndex + 1);
      };

      calculateUserRank();

      const today = new Date();
      const userStreak = getUserDailyStreak(today);
      setDailyStreak(userStreak);

      // Maximum Streak calculation here if needed
    }
  }, [AllUsers, userId]);

  useEffect(() => {
    if (Array.isArray(DailyInteraction)) {
      const calculateUserStreak = () => {
        const userInteractions = DailyInteraction.filter(entry => entry.userId === userId && entry.count > 0);
        if (userInteractions.length === 0) {
          console.log("User Streak: 0");
          setMaxStreak(0);
          return;
        }

        const sortedInteractions = userInteractions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        let streak = 1;
        const oneDayMs = 24 * 60 * 60 * 1000;

        for (let i = 1; i < sortedInteractions.length; i++) {
          const currentDate = new Date(sortedInteractions[i].date);
          const previousDate = new Date(sortedInteractions[i - 1].date);
          const dayDifference = (currentDate.getTime() - previousDate.getTime()) / oneDayMs;

          if (dayDifference === 1) {
            streak++;
          } else if (dayDifference > 1) {
            streak = 1;
          }
        }

        console.log("User Streak:", streak);
        setMaxStreak(streak);
      };

      calculateUserStreak();
    }
  }, [DailyInteraction, userId]);

  const getUserDailyStreak = (date: Date): number => {
    const dailyInteractions = DailyInteraction?.filter(interaction =>
      interaction.date === date.toISOString().split('T')[0] &&
      interaction.userId === userId
    ) || [];
    return dailyInteractions.length > 0 ? 1 : 0;
  };

  const getMaxStreak = () => {
    if (!DailyInteraction || DailyInteraction.length === 0) {
      return 0;
    }

    const sortedDates = Array.from(new Set(DailyInteraction.map(interaction => interaction.date)));
    sortedDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    let maxStreak = 0;
    let currentStreak = 0;
    let lastDate = null;

    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);

      if (lastDate) {
        const expectedNextDate = new Date(lastDate);
        expectedNextDate.setDate(expectedNextDate.getDate() + 1);

        if (currentDate.getTime() === expectedNextDate.getTime()) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      maxStreak = Math.max(maxStreak, currentStreak);
      lastDate = currentDate;
    }

    return maxStreak;
  };

  return (
    <main className="w-full px-10">
      <Header rank={rank} maxStreak={maxStreak} handleModalOpen={handleModalOpen}  />
      <Separator className="bg-gray-400" />
      <div className="flex mt-5 flex-col h-full w-full gap-5 p-5 bg-gray-500 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-10 border border-slate-100 overflow-hidden overflow-x-scroll rounded-xl">
        <div>
          <div className="flex flex-row w-full items-start justify-between gap-3 overflow-hidden">
            <div className="w-[66%]">
              <GitMap totalInteractions={TotalInteractions} dailyInteractions={DailyInteraction || []} />
            </div>
            <div className="w-[33%] flex flex-col gap-3">
              <Meter percentage={percentage ?? 0} title="Accuracy" />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row gap-3 h-[60rem]">
          <div className="bg-white w-[66%] p-7 rounded-xl pt-10">
            <Heading>History</Heading>
            <Separator />
            <TestTables UserTestHistory={UserTestHistory} UserInterviewHistory={UserInterviewHistory} />
          </div>
          <div className="bg-white w-[33%] p-7 pt-10 rounded-xl -mt-[15rem]">
            <Heading>Leaderboard</Heading>
            <Separator />
            <Leaderboard TopUsers={TopUsers} />
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleFileUpload}
        ResumeFiles={ResumeFiles}
      />
      <Loader />
    </main>
  );
};

export default Dashboard;
