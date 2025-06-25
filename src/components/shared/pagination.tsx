import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {Button} from "../ui/button";
import {useEffect, useState} from "react";
import {getPaginationNumbers} from "@/lib/utils";
import {Card, CardContent} from "../ui/card";

interface PaginationProps {
  totalPages: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  totalPages,
  currentPage = 1,
  onPageChange,
}: PaginationProps) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(currentPage);
  const paginationNumbers = getPaginationNumbers(
    internalCurrentPage,
    totalPages,
  );

  useEffect(() => {
    setInternalCurrentPage(currentPage);
  }, [currentPage]);

  const handleChangePage = (nextPage: number) => {
    if (nextPage <= 0) return;
    if (nextPage > totalPages) return;

    setInternalCurrentPage(nextPage);
    onPageChange?.(nextPage - 1);
  };

  return (
    <Card>
      <CardContent className="flex justify-center gap-1">
        <Button
          className="hidden md:block"
          variant="secondary"
          onClick={() => handleChangePage(1)}
          disabled={internalCurrentPage === 1}
        >
          <ChevronFirst className="size-4" />
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleChangePage(internalCurrentPage - 1)}
          disabled={internalCurrentPage === 1}
        >
          <ChevronLeft className="size-4" />
        </Button>

        {paginationNumbers.map((page, index) => (
          <Button
            variant={internalCurrentPage === page ? "default" : "ghost"}
            disabled={page === "..."}
            key={index}
            size="icon"
            onClick={() => handleChangePage(+page)}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="secondary"
          onClick={() => handleChangePage(internalCurrentPage + 1)}
          disabled={internalCurrentPage === totalPages}
        >
          <ChevronRight className="size-4" />
        </Button>
        <Button
          className="hidden md:block"
          variant="secondary"
          onClick={() => handleChangePage(totalPages)}
          disabled={internalCurrentPage === totalPages}
        >
          <ChevronLast className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
