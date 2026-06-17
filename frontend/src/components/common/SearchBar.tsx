import React from "react";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  value: string;
  onChange: (_: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder ?? t("searchBar.placeholder");
  return (
    <div className="relative">
      <span className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-on-surface-variant left-4">
        search
      </span>
      <input
        className="w-full h-12 pl-12 pr-4 rounded-xl bg-surface-container-low text-body-md font-body-md text-on-surface focus:ring-2 focus:ring-primary transition-all placeholder:text-outline"
        placeholder={resolvedPlaceholder}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
