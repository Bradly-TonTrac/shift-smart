"use client";

import { useRouter } from "next/navigation";

const Pagination = ({
  currentPage,
  totalPage,
}: {
  currentPage: number;
  totalPage: number;
}) => {
  const router = useRouter();
  return (
    <div>
      <div className="join">
        {Array.from({ length: totalPage }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            className={`join-item btn btn-square ${currentPage === pageNum ? "btn-active" : ""}`}
            onClick={() => router.push(`/employees?page=${pageNum}`)}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
