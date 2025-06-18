import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {Button} from "../ui/button";
import {useState} from "react";
import {getPaginationNumbers} from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
}

export function Pagination({totalPages}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const paginationNumbers = getPaginationNumbers(currentPage, totalPages);

  const onChangePage = (nextPage: number) => {
    if (nextPage <= 0) return;
    if (nextPage > totalPages) return;
    setCurrentPage(nextPage);
  };

  return (
    <div className="flex justify-center gap-1 pt-4">
      <Button
        className="hidden md:block"
        variant="secondary"
        onClick={() => onChangePage(1)}
        disabled={currentPage === 1}
      >
        <ChevronFirst className="size-4" />
      </Button>
      <Button
        variant="secondary"
        onClick={() => onChangePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="size-4" />
      </Button>

      {paginationNumbers.map((page, index) => (
        <Button
          variant={currentPage === page ? "default" : "ghost"}
          disabled={page === "..."}
          key={index}
          size="icon"
          onClick={() => onChangePage(+page)}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="secondary"
        onClick={() => onChangePage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="size-4" />
      </Button>
      <Button
        className="hidden md:block"
        variant="secondary"
        onClick={() => onChangePage(totalPages)}
        disabled={currentPage === totalPages}
      >
        <ChevronLast className="size-4" />
      </Button>
    </div>
  );
}
