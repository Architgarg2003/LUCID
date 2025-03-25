import React, { useState, useEffect } from 'react'
import Heading from './ui/Heading'
import SearchBar from './ui/SearchBar'
import GeneratedCard from './ui/GeneratedCard'
import DynamicGrid from './ui/DynamicGrid'
import { api } from "../convex/_generated/api";
import { useAction, useQuery } from "convex/react";

interface GeneratedTestsI {
  allCards?: any
}

const GeneratedInterview = ({ allCards }: GeneratedTestsI) => {
  const [search, setSearch] = useState("");
  const [searched, setSearched] = useState(null);

  const searchCard = useAction(api.GeneratedInterviewCardSearch.similarCards);

  useEffect(() => {
    const handleSearch = async () => {
      if (search.trim()) {
        try {
          const result = await searchCard({ text: search });
          setSearched(result);
          console.log(result);
        } catch (error) {
          console.error("Error searching cards:", error);
        }
      } else {
        setSearched(null);
      }
    };

    handleSearch();
  }, [search, searchCard]);

  // Map the fetched cards to the format expected by DynamicGrid
  const cardsToDisplay = (search !== '' || searched !== null) ? searched : allCards;

  const cardsData = cardsToDisplay?.map((card: { _id: string; userId: string; companyName: string; jobTitle: string; createdAt: string; starsCount: number; upvoteCount: number; tags: string[]; InterviewId: string }) => ({
    content: (
      <GeneratedCard
        key={card?._id}
        user={card?.userId}
        companyName={card?.companyName}
        jobTitle={card?.jobTitle}
        createdAt={card?.createdAt}
        starsCount={Number(card?.starsCount)}
        upvoteCount={Number(card?.upvoteCount)}
        tags={card?.tags}
        InterviewId={card?.InterviewId}
        cardId={card?._id}
        isInterview={true}
      />
    )
  })) || [];

  return (
    <div className="md:pt-6 md:pl-[4rem] p-2">
      <Heading>Generated Interview</Heading>
      <div className='flex flex-col gap-10 pt-6'>
        <div className='flex items-center justify-center px-5'>
          <SearchBar
            search={search}
            setSearch={setSearch}
          />
        </div>
        <div>
          <DynamicGrid cardsData={cardsData} />
        </div>
      </div>
    </div>
  );
}

export default GeneratedInterview;
