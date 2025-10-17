import {useState, useRef, useEffect} from "react";

interface UseCategoryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
}

export const useCategoryAutocomplete = ({
  value,
  onChange,
  categories,
}: UseCategoryAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter categories based on input value
  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(inputValue.toLowerCase()),
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setInputValue(category);
    onChange(category);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsOpen(true);
  };

  // Handle input blur with delay to allow clicking on dropdown items
  const handleInputBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Update input value when external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return {
    // State
    isOpen,
    inputValue,
    filteredCategories,

    // Refs
    inputRef,
    dropdownRef,

    // Handlers
    handleInputChange,
    handleCategorySelect,
    handleInputFocus,
    handleInputBlur,
    handleKeyDown,
  };
};
