import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  placeholder = "Search...",
  onSearch,
  className,
  ...props 
}) => {
  const [value, setValue] = useState("");

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setValue(searchValue);
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <ApperIcon name="Search" size={16} className="text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleSearch}
        className="pl-12"
        {...props}
      />
    </div>
  );
};

export default SearchBar;