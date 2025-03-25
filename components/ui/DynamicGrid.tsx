"use client"
import React, { useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { HoverEffect } from "../ui/card-hover-effect";
interface DynamicGridIP {
    cardsData: { content: React.ReactNode }[];
}

const DynamicGrid = ({ cardsData }: DynamicGridIP) => {

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // 4x3 grid, so 12 items per page

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const paginatedItems = cardsData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(cardsData.length / itemsPerPage);


    return (
        <div className="p-0 md:p-5 pt-0 w-[95%] overflow-hidden pr-0 md:pr-10 data-uk-grid">
            {/* <div className="grid grid-cols-4 grid-rows-3 gap-5"> */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedItems.map((card, index) => (
                    <div key={index}>{card.content}</div>
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent className="pt-10">
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                            />
                        </PaginationItem>

                        {[...Array(totalPages)].map((_, pageIndex) => (
                            <PaginationItem key={pageIndex}>
                                <PaginationLink
                                    href="#"
                                    isActive={currentPage === pageIndex + 1}
                                    onClick={() => handlePageChange(pageIndex + 1)}
                                >
                                    {pageIndex + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default DynamicGrid;