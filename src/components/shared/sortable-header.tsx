import {Button} from "../ui/button";
import {ChevronDown, ChevronUp, ChevronsUpDown} from "lucide-react";
import {cn} from "@/lib/utils";
import type {Order, Sort} from "@/interfaces/product/sort.interface";
import {Badge} from "../ui/badge";

interface SortableHeaderProps {
  field: string;
  children: React.ReactNode;
  sortFields: Sort[];
  onSort: (field: string, order: Order) => void;
  className?: string;
}

export function SortableHeader({
  field,
  children,
  sortFields,
  onSort,
  className,
}: SortableHeaderProps) {
  const currentSort = sortFields.find((sort) => sort.field === field);
  const sortIndex = sortFields.findIndex((sort) => sort.field === field);

  const handleSort = () => {
    console.log("handleSort", field, currentSort);
    if (!currentSort) {
      onSort(field, "asc");
    } else if (currentSort.order === "asc") {
      onSort(field, "desc");
    } else {
      onSort(field, "desc");
    }
  };

  const getSortIcon = () => {
    if (!currentSort) {
      return <ChevronsUpDown className="ml-2 h-4 w-4" />;
    }
    return currentSort.order === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <Button
      variant="ghost"
      onClick={handleSort}
      className={cn(
        "flex h-auto justify-start p-0 font-semibold hover:bg-transparent",
        currentSort && "text-green-600",
        className,
      )}
    >
      <span className="flex items-center">
        {children}
        {getSortIcon()}
        {sortIndex !== -1 && <Badge className="ml-2">{sortIndex + 1}</Badge>}
      </span>
    </Button>
  );
}
