import React from "react";

interface SettingRowProps {
  icon: string;
  title: string;
  color: "orange" | "yellow" | "blue" | "red";
  type: "button" | "toggle";
  buttonLabel?: string;
  onAction?: () => void;
  toggled?: boolean;
  onToggle?: (_value: boolean) => void;
}

const colorStyles = {
  orange: {
    bg: "bg-primary-fixed",
    text: "text-primary-container",
    hoverBg: "group-hover:bg-primary-container",
  },
  yellow: {
    bg: "bg-secondary-fixed",
    text: "text-secondary",
    hoverBg: "group-hover:bg-secondary",
  },
  blue: {
    bg: "bg-tertiary-fixed",
    text: "text-tertiary-container",
    hoverBg: "group-hover:bg-tertiary",
  },
  red: {
    bg: "bg-error-container",
    text: "text-error",
    hoverBg: "group-hover:bg-error",
  },
};

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  title,
  color,
  type,
  buttonLabel,
  onAction,
  toggled,
  onToggle,
}) => {
  const { bg, text, hoverBg } = colorStyles[color];

  const handleClick = () => {
    if (type === "button" && onAction) {
      onAction();
    } else if (type === "toggle" && onToggle) {
      onToggle(!toggled);
    }
  };

  return (
    <button
      className="w-full text-left bg-surface-container-lowest p-md rounded-xl card-shadow border border-outline-variant squishy-active group transition-all duration-300 hover:border-primary-container flex items-center gap-4"
      onClick={handleClick}
    >
      <div
        className={`w-14 h-14 ${bg} rounded-full flex items-center justify-center ${hoverBg} transition-all duration-300 shrink-0`}
      >
        <span
          className={`material-symbols-outlined ${text} group-hover:text-white text-[32px] transition-all duration-300`}
        >
          {icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-headline-md text-on-surface text-[20px]">
          {title}
        </h3>
      </div>
      {type === "button" ? (
        <span className="text-sm font-medium text-on-surface-variant shrink-0 bg-outline-variant/20 px-4 py-1.5 rounded-full">
          {buttonLabel}
        </span>
      ) : (
        <div
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 shrink-0 ${
            toggled ? "bg-primary" : "bg-outline-variant"
          }`}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
              toggled ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </div>
      )}
    </button>
  );
};

export default SettingRow;
