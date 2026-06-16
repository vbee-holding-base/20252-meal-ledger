import React, { useState } from "react";

interface SimpleInputCardProps {
  value: string;
  onChange: (_value: string) => void;
  title?: string;
  placeholder?: string;
  rows?: number;
}

const InputCard: React.FC<SimpleInputCardProps> = ({
  value,
  onChange,
  title = "Nhập thông tin",
  placeholder = "",
  rows = 6,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <section
      className={`bg-surface-container-lowest rounded-3xl p-md border border-outline-variant transition-all duration-300 card-shadow ${
        isFocused ? "ring-2 ring-primary-container/20" : ""
      }`}
    >
      {title && (
        <h2 className="text-headline-md text-on-surface mb-base font-medium">
          {title}
        </h2>
      )}

      <div className="relative mb-md">
        <textarea
          className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary-container focus:ring-0 rounded-2xl p-md text-body-md text-on-surface transition-all duration-300 outline-none resize-none"
          placeholder={placeholder}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </section>
  );
};

export default InputCard;
