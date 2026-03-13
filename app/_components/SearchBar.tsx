"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

const SearchBar = () => {
  const router = useRouter();

  const timeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pushes a query param to the URL on every keystroke to filter employees.
  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeRef.current!);

    const searchValue = e.target.value;

    timeRef.current = setTimeout(() => {
      router.push(`/employees?query=${searchValue}`);
    }, 300);
  };

  return (
    <div>
      <label className="input w-150 bg-gray-100 shadow">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input type="search" required placeholder="Search" onChange={search} />
      </label>
    </div>
  );
};

export default SearchBar;
