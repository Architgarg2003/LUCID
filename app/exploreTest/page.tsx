
"use client"; // Ensures the component is client-side only

import React, { useEffect, useState } from 'react';
import { Separator } from "@/components/ui/separator";
// import Featured from "@/components/Featured";
// import GeneratedTests from "@/components/GeneratedTests";
import { useAuth, useUser } from "@clerk/nextjs";
// import NewModal from "@/components/NewModal";
import { useAction, useMutation, useQuery } from "convex/react";
import { useLoader } from "../LoaderContext";
import { api } from "../../convex/_generated/api";
// import Loader from "@/components/ui/Loader";
import { useRouter } from 'next/navigation';


import dynamic from 'next/dynamic';

const Loader = dynamic(() => import('@/components/ui/Loader'), { ssr: false });
const NewModal = dynamic(() => import('@/components/NewModal'), { ssr: false });
const GeneratedTests = dynamic(() => import('@/components/GeneratedTests'), { ssr: false });
const Featured = dynamic(() => import('@/components/Featured'), { ssr: false });

const Test = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  const [questions, setQuestions] = useState<any>(null);
  const [jobDescription, setJd] = useState<string>("");
  const [resume, setResume] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  // const [routeId, setRouteId] = useState<string | null>(null);

  const generateMCQ = useAction(api.create_mcq.generateMCQ);
  const pushMCQ = useMutation(api.create_mcq.push_mcq);
  const generateTags = useAction(api.GetTags.getTags);
  const createCards = useMutation(api.CreateCard.Create_card);
  const createEmbedding = useAction(api.createEmbedding.createEmbeddings);
  const allCards = useQuery(api.getAllGeneratedCards.getAllGeneratedCards);
  const allFeaturedCards = useQuery(api.getAllFeaturedCards.getAllFeaturedCards);
  const heatmapfunction = useMutation(api.PushHeatMap.handleDailyInteraction);
  const LeaderBoardEntry = useMutation(api.LeaderBoard.ensureLeaderboardEntry);
  const InitializeTodaysEntry = useMutation(api.PushHeatMap.onLoginInteraction);
  const { showLoader, hideLoader } = useLoader();
  const router = useRouter();


  const [loading ,setLoading] = useState<boolean>(false);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!userId) {
      router.push('/');
    }
  }, [userId, router]);

  // Handle analytics and leaderboard updates
  useEffect(() => {
    async function handleAnalytics() {
      if (userId && user?.firstName) {
        await Promise.all([
          heatmapfunction({ userId }),
          LeaderBoardEntry({ userId, username: user.firstName }),
          InitializeTodaysEntry({ userId })
        ]);
      }
    }
    handleAnalytics();
  }, [userId, user?.firstName, heatmapfunction, LeaderBoardEntry, InitializeTodaysEntry]);

  const handleGenerateMCQ = async () => {
    // showLoader();
    setLoading(true);
    try {
      if (!userId) {
        console.error("User ID is not available");
        return;
      }

      const mcqArray = await generateMCQ({ jobTitle, jobDescription, resume, difficulty, companyName });
      setQuestions(mcqArray);

      const tags = await generateTags({ questions: mcqArray });
      const testId = await pushMCQ({ userId, mcqArray });

      if (!testId) {
        console.error("Test not pushed");
        return;
      }

      let jobTitleEmbedding;
      let embeddingsArray;
      try {
        jobTitleEmbedding = await createEmbedding({ text: jobTitle });
        if (!jobTitleEmbedding || !jobTitleEmbedding.values) {
          throw new Error('Invalid embedding response');
        }
        embeddingsArray = Array.isArray(jobTitleEmbedding.values)
          ? jobTitleEmbedding.values
          : [jobTitleEmbedding.values];
      } catch (error) {
        console.error("Error creating embedding:", error);
        return;
      }

      const cardId = await createCards({
        tags,
        companyName,
        jobTitle,
        jobDescription,
        userId,
        testId,
        resume,
        difficulty,
        jobTitleEmbeddings: embeddingsArray
      });

      if (cardId && testId) {
        router.push(`/${testId}/start`);
      }
    } catch (error) {
      console.error("Error creating questions:", error);
    } 
    // finally {
    //   setLoading(false);
    // }
  };

  // Handle loading state
  useEffect(() => {
    if (!allCards && !allFeaturedCards) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [allCards, allFeaturedCards, showLoader, hideLoader]);

  if(loading){
    return (
      <div className='fixed flex inset-0 z-50 flex-col items-center gap-5 justify-center bg-white bg-opacity-75'>
        <l-jelly-triangle
          size="60"
          speed="1.75"
          color="#4F2FA0"
        ></l-jelly-triangle>
        Lucid intelligence creating your test
      </div>
    )
  }

  return (
    <main className="h-full w-screen">
      <div className="flex flex-row justify-between">
        <div className="p-10 pb-2">
          <h1 className="flex flex-col items-start gap-3">
            <span className="text-lg font-semibold text-gray-600">Welcome to</span>
            <span className="text-4xl font-bold text-[#7c3aed] flex flex-row gap-2">
              Lucid <span className="text-black">Tests</span>
            </span>
          </h1>
        </div>
        <div className="md:px-20 md:py-[4.5rem] md:pb-2 p-1 hidden md:block">
          <NewModal
            handleGenerateMCQ={handleGenerateMCQ}
            setJd={setJd}
            setResume={setResume}
            setJobTitle={setJobTitle}
            setCompanyName={setCompanyName}
            setDifficulty={setDifficulty}
          />
        </div>
      </div>
      <div>
        <Separator className="bg-gray-400 w-[95%] md:w-[92%] md:ml-10" />
      </div>
      <Featured allFeaturedCards={allFeaturedCards} />
      <GeneratedTests allCards={allCards} />
      <Loader />
    </main>
  );
};

export default Test;







// "use client";

// import React, { useEffect, useState } from 'react';
// import { Separator } from "@/components/ui/separator";
// import { useAuth, useUser } from "@clerk/nextjs";
// import { useAction, useMutation, useQuery } from "convex/react";
// import { useLoader } from "../LoaderContext";
// import { api } from "../../convex/_generated/api";
// import { useRouter } from 'next/navigation';
// import dynamic from 'next/dynamic';

// const Loader = dynamic(() => import('@/components/ui/Loader'), { ssr: false });
// const NewModal = dynamic(() => import('@/components/NewModal'), { ssr: false });
// const GeneratedTests = dynamic(() => import('@/components/GeneratedTests'), { ssr: false });
// const Featured = dynamic(() => import('@/components/Featured'), { ssr: false });

// const Test = () => {
//   const { userId } = useAuth();
//   const { user } = useUser();
//   const [questions, setQuestions] = useState<any>(null);
//   const [jobDescription, setJd] = useState<string>("");
//   const [resume, setResume] = useState<string>("");
//   const [jobTitle, setJobTitle] = useState<string>("");
//   const [companyName, setCompanyName] = useState<string>("");
//   const [difficulty, setDifficulty] = useState<string>("");
//   const [routeId, setRouteId] = useState<string | null>(null);
//   const [isGenerating, setIsGenerating] = useState(false);

//   const generateMCQ = useAction(api.create_mcq.generateMCQ);
//   const pushMCQ = useMutation(api.create_mcq.push_mcq);
//   const generateTags = useAction(api.GetTags.getTags);
//   const createCards = useMutation(api.CreateCard.Create_card);
//   const createEmbedding = useAction(api.createEmbedding.createEmbeddings);
//   const allCards = useQuery(api.getAllGeneratedCards.getAllGeneratedCards);
//   const allFeaturedCards = useQuery(api.getAllFeaturedCards.getAllFeaturedCards);
//   const heatmapfunction = useMutation(api.PushHeatMap.handleDailyInteraction);
//   const LeaderBoardEntry = useMutation(api.LeaderBoard.ensureLeaderboardEntry);
//   const InitializeTodaysEntry = useMutation(api.PushHeatMap.onLoginInteraction);
//   const { showLoader, hideLoader } = useLoader();
//   const router = useRouter();

//   useEffect(() => {
//     if (!userId) {
//       router.push('/');
//     }
//   }, [userId, router]);

//   useEffect(() => {
//     async function handleAnalytics() {
//       if (userId && user?.firstName) {
//         await Promise.all([
//           heatmapfunction({ userId }),
//           LeaderBoardEntry({ userId, username: user.firstName }),
//           InitializeTodaysEntry({ userId })
//         ]);
//       }
//     }
//     handleAnalytics();
//   }, [userId, user?.firstName, heatmapfunction, LeaderBoardEntry, InitializeTodaysEntry]);

//   const handleGenerateMCQ = async () => {
//     setIsGenerating(true);
//     showLoader();
//     try {
//       if (!userId) {
//         console.error("User ID is not available");
//         return;
//       }

//       const mcqArray = await generateMCQ({ jobTitle, jobDescription, resume, difficulty, companyName });
//       setQuestions(mcqArray);

//       const tags = await generateTags({ questions: mcqArray });
//       const testId = await pushMCQ({ userId, mcqArray });

//       if (!testId) {
//         console.error("Test not pushed");
//         return;
//       }

//       let jobTitleEmbedding;
//       let embeddingsArray;
//       try {
//         jobTitleEmbedding = await createEmbedding({ text: jobTitle });
//         if (!jobTitleEmbedding || !jobTitleEmbedding.values) {
//           throw new Error('Invalid embedding response');
//         }
//         embeddingsArray = Array.isArray(jobTitleEmbedding.values)
//           ? jobTitleEmbedding.values
//           : [jobTitleEmbedding.values];
//       } catch (error) {
//         console.error("Error creating embedding:", error);
//         return;
//       }

//       const cardId = await createCards({
//         tags,
//         companyName,
//         jobTitle,
//         jobDescription,
//         userId,
//         testId,
//         resume,
//         difficulty,
//         jobTitleEmbeddings: embeddingsArray
//       });

//       if (cardId && testId) {
//         router.push(`/${testId}/start`);
//       }
//     } catch (error) {
//       console.error("Error creating questions:", error);
//     } finally {
//       setIsGenerating(false);
//       hideLoader();
//     }
//   };

//   useEffect(() => {
//     if (!allCards && !allFeaturedCards) {
//       showLoader();
//     } else {
//       hideLoader();
//     }
//   }, [allCards, allFeaturedCards, showLoader, hideLoader]);

//   return (
//     <main className="h-full w-screen">
//       <div className="flex flex-row justify-between">
//         <div className="p-10 pb-2">
//           <h1 className="flex flex-col items-start gap-3">
//             <span className="text-lg font-semibold text-gray-600">Welcome to</span>
//             <span className="text-4xl font-bold text-[#7c3aed] flex flex-row gap-2">
//               Axiom <span className="text-black">Tests</span>
//             </span>
//           </h1>
//         </div>
//         <div className="md:px-20 md:py-[4.5rem] md:pb-2 p-1 hidden md:block">
//           <NewModal
//             handleGenerateMCQ={handleGenerateMCQ}
//             setJd={setJd}
//             setResume={setResume}
//             setJobTitle={setJobTitle}
//             setCompanyName={setCompanyName}
//             setDifficulty={setDifficulty}
//           />
//         </div>
//       </div>
//       <div>
//         <Separator className="bg-gray-400 w-[95%] md:w-[92%] md:ml-10" />
//       </div>
//       <Featured allFeaturedCards={allFeaturedCards} />
//       <GeneratedTests allCards={allCards} />
//       {isGenerating && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <Loader />
//         </div>
//       )}
//     </main>
//   );
// };

// export default Test;