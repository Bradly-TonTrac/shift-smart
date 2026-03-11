import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

const TablePagination = ({
  currentPage,
  totalPage,
}: {
  currentPage: number;
  totalPage: number;
}) => {
  return (
    <div>
      <Pagination>
        <PaginationContent>
          {/* Generate a pagination link for each page number */}
          {Array.from({ length: totalPage }, (_, i) => i + 1).map((pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href={`/employees?page=${pageNum}`}
                isActive={currentPage === pageNum}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TablePagination;
