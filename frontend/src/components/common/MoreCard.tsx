import React from "react";
import { useNavigate } from "react-router-dom";

export interface MoreCardItem {
  path: string;
  icon: string;
  title: string;
  subtitle: string;
}

interface MoreCardProps {
  item: MoreCardItem;
  color: "orange" | "yellow" | "blue";
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
};

const MoreCard: React.FC<MoreCardProps> = ({ item, color }) => {
  const navigate = useNavigate();
  const { bg, text, hoverBg } = colorStyles[color];

  return (
    <button
      className="w-full text-left bg-surface-container-lowest p-md rounded-xl card-shadow border border-outline-variant squishy-active group transition-all duration-300 hover:border-primary-container flex items-center gap-4"
      onClick={() => navigate(item.path)}
    >
      <div
        className={`w-14 h-14 ${bg} rounded-full flex items-center justify-center ${hoverBg} transition-all duration-300`}
      >
        <span
          className={`material-symbols-outlined ${text} group-hover:text-white text-[32px] transition-all duration-300`}
        >
          {item.icon}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="font-headline-md text-on-surface text-[20px]">
          {item.title}
        </h3>
        <p className="text-on-surface-variant font-label-sm">{item.subtitle}</p>
      </div>
      <span className="material-symbols-outlined text-outline">
        chevron_right
      </span>
    </button>
  );
};

export default MoreCard;
