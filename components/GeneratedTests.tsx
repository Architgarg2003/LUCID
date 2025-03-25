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

const GeneratedTests = ({ allCards }: GeneratedTestsI) => {
  const [search, setSearch] = useState("");
  const [searched, setSearched] = useState(null);

  const searchCard = useAction(api.GeneratedCardSearch.similarCards);

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

  const cardsData = cardsToDisplay?.map((card: { _id: string; userId: string; companyName: string; jobTitle: string; createdAt: string; starsCount: number; upvoteCount: number; tags: string[]; testId: string }) => ({
    content: (
      <GeneratedCard
        key={card._id}
        user={card.userId}
        companyName={card.companyName}
        jobTitle={card.jobTitle}
        createdAt={card.createdAt}
        starsCount={Number(card.starsCount)}
        upvoteCount={Number(card.upvoteCount)}
        tags={card.tags}
        testId={card.testId}
        cardId={card._id}
      />
    )
  })) || [];

  return (
    <div className="md:pt-6 pt-2 md:pl-[4rem] pl-4">
      <Heading className=" sm:text-3xl text-2xl lg:text-3xl xl:text-4xl">
        Generated Tests
      </Heading>
      <div className='flex flex-col gap-6 md:gap-10 pt-3 md:pt-6'>
        <div className='flex items-center justify-center  md:px-5'>
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

export default GeneratedTests;
