import React from "react";

interface SearchBarProps {
    search: string;
    setSearch: (value: string) => void;
}

const SearchBar = ({ search, setSearch }: SearchBarProps) => {
    return (
        <div className="pr-[10%] w-full">
            <div className="container mx-auto bg-[#E9D5FF] rounded-xl p-1 w-[100%] border border-[#9BA3AF]">
                <div className="sm:flex items-center bg-white rounded-lg overflow-hidden px-2 py-1 justify-between">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="text-base text-gray-400 flex-grow outline-none px-2"
                        type="text"
                        placeholder="Search your domain name"
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
