import React from "react";
import { useNavigate } from "react-router-dom";

interface TopAppBarProps {
  title: string;
  showBack?: boolean;
}

const TopAppBar: React.FC<TopAppBarProps> = ({ title, showBack = true }) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full max-w-md z-50 flex items-center justify-between px-margin-mobile h-16 bg-surface">
      {showBack ? (
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary-container/10 transition-colors active:scale-95 duration-200"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined text-primary">
            arrow_back
          </span>
        </button>
      ) : (
        <div className="w-10" />
      )}
      <h1
        className="absolute inset-0 flex items-center justify-center font-headline-md text-headline-md pointer-events-none"
        style={{ color: "#ff7a00" }}
      >
        {title}
      </h1>
      <div className="w-10" />
    </header>
  );
};

export default TopAppBar;
