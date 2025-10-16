import {Input} from "../ui/input";
import {Label} from "../ui/label";
import {cn} from "@/lib/utils";
import {ChevronDownIcon} from "lucide-react";
import {useCategoryAutocomplete} from "@/hooks/useCategoryAutocomplete";

interface CategoryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
  placeholder?: string;
  id?: string;
}

export const CategoryAutocomplete = ({
  value,
  onChange,
  categories,
  placeholder = "Select or type a category",
  id,
}: CategoryAutocompleteProps) => {
  const {
    isOpen,
    inputValue,
    filteredCategories,
    inputRef,
    dropdownRef,
    handleInputChange,
    handleCategorySelect,
    handleInputFocus,
    handleInputBlur,
    handleKeyDown,
  } = useCategoryAutocomplete({
    value,
    onChange,
    categories,
  });

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>Category</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          id={id}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pr-8"
        />
        <ChevronDownIcon
          className={cn(
            "text-muted-foreground absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 transition-transform",
            isOpen && "rotate-180",
          )}
        />

        {isOpen && (
          <div
            ref={dropdownRef}
            className="bg-popover absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border shadow-md"
          >
            {filteredCategories.length > 0 ? (
              <div className="p-1">
                {filteredCategories.map((category) => (
                  <div
                    key={category}
                    className="hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-sm px-2 py-1.5 text-sm"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground p-2 text-sm">
                {inputValue
                  ? "No categories found"
                  : "Type to search categories"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
