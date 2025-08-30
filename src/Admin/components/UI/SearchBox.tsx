import React from "react";
import { Search } from "lucide-react";

interface SearchBoxProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="my-9 card-luxury rounded-2xl p-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-lavender-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="form-input pl-10 pr-4 py-2 rounded-xl font-body w-full"
        />
      </div>
    </div>
  );
};

export default SearchBox;
