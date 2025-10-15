import {useState} from "react";
import {Label} from "../ui/label";
import {cn} from "@/lib/utils";
import {CheckIcon, ChevronDownIcon, PlusIcon} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Button} from "../ui/button";

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
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const hasMatchingCategory = categories.some((category) =>
    category.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const showNewCategoryOption = searchValue && !hasMatchingCategory;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Category</Label>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            id={id}
          >
            {value || placeholder}
            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          align="start"
        >
          <Command>
            <CommandInput
              placeholder="Search categories..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                {searchValue ? (
                  <CommandItem
                    value={searchValue}
                    onSelect={() => {
                      onChange(searchValue);
                      setSearchValue("");
                      setOpen(false);
                    }}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Create "{searchValue}"
                  </CommandItem>
                ) : (
                  <div className="text-muted-foreground py-6 text-center text-sm">
                    Type to search categories
                  </div>
                )}
              </CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category}
                    value={category}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === category ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {category}
                  </CommandItem>
                ))}
                {showNewCategoryOption && (
                  <CommandItem
                    value={searchValue}
                    onSelect={() => {
                      onChange(searchValue);
                      setSearchValue("");
                      setOpen(false);
                    }}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Create "{searchValue}"
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
