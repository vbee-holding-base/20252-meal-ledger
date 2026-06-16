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
    <div className="w-full p-4 pb-safe">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full h-14 flex items-center justify-center gap-sm bg-primary-container text-white font-semibold text-lg rounded-full hover:bg-primary active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none transition-all duration-200"
      >
        {title}
      </button>
    </div>
  );
};

export default SubmitButton;
