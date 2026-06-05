import React, { useState } from "react";

interface SimpleInputCardProps {
  value: string;
  onChange: (_value: string) => void;
  onSubmit?: () => void;
  title?: string;
  placeholder?: string;
  rows?: number;
}

const InputCard: React.FC<SimpleInputCardProps> = ({
  value,
  onChange,
  onSubmit,
  title = "Nhập thông tin",
  placeholder = "",
  rows = 6,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <section
      className={`bg-surface-container-lowest rounded-3xl p-md border border-outline-variant/30 transition-all duration-300 shadow-[0_4px_20px_rgba(153,71,0,0.05)] ${
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
          className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary-container focus:ring-0 rounded-2xl p-md text-body-md transition-all duration-300 outline-none resize-none"
          placeholder={placeholder}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      <div className="w-full">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!value.trim()}
          className="w-full h-14 flex items-center justify-center gap-sm bg-[#ff7a00] text-white font-semibold text-lg rounded-full shadow-[0_4px_12px_rgba(255,122,0,0.2)] hover:bg-[#e06c00] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none transition-all duration-200"
        >
          <span>Phân tích</span>
          <span className="material-symbols-outlined text-[22px] font-bold">
            check_circle
          </span>
        </button>
      </div>
    </section>
  );
};

export default InputCard;
