import React from 'react';
import Heading from './ui/Heading';
import Cards from './ui/Card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface FeaturedI{
    allFeaturedCards?:any
    isInterview?:boolean
}

const Featured = ({ allFeaturedCards, isInterview }: FeaturedI) => {
    return (
        <div className="md:pt-6 p-2 md:pl-[4rem] md:pr-20">
            <Heading>Featured</Heading>
            <div className='w-full flex flex-row overflow-x-scroll h-max overflow-hidden '>
                {allFeaturedCards?.map((data:any, index:any) => (
                        <div key={index} className="p-5 flex-row inline-flex p">
                            <Cards  data={data} isInterview={isInterview}/>
                        </div>
                ))}
            </div>
        </div>
    );
};

export default Featured;