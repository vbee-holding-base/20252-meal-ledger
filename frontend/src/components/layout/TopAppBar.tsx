import React from "react";
import { useNavigate } from "react-router-dom";

interface TopAppBarProps {
  title: string;
  showBack?: boolean;
}

const TopAppBar: React.FC<TopAppBarProps> = ({ title, showBack = true }) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full max-w-md z-50 flex items-center px-margin-mobile h-16 bg-surface border-b border-outline-variant">
      <div className="w-10 flex items-center justify-center">
        {showBack && (
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary-container/10 transition-colors active:scale-95 duration-200"
            onClick={() => navigate("/")}
          >
            <span className="material-symbols-outlined text-primary">
              arrow_back
            </span>
          </button>
        )}
      </div>
      <h1 className="flex-1 text-center font-headline-md text-headline-md pointer-events-none text-primary-container">
        {title}
      </h1>
      <div className="w-10" />
    </header>
  );
};

export default TopAppBar;
