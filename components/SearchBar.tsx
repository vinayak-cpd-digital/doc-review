"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search..." }: SearchBarProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [value, onSearch]);

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 placeholder:text-gray-500"
        style={{ borderColor: '#e5d0da', outlineColor: '#be1549' }}
        onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px #be154966'; }}
        onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
