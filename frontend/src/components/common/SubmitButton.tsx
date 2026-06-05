import React from "react";

interface SubmitButtonProps {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  title,
  onClick,
  disabled = false,
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md p-4 pb-safe z-40">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full h-14 flex items-center justify-center gap-sm bg-[#ff7a00] text-white font-semibold text-lg rounded-full hover:bg-[#e06c00] active:scale-[0.98] disabled:opacity-40 disabled:bg-gray-300 disabled:text-gray-500 disabled:pointer-events-none transition-all duration-200"
      >
        {title}
      </button>
    </div>
  );
};

export default SubmitButton;
