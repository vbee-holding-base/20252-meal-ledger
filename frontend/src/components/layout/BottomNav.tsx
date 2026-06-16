import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", icon: "home", label: "Trang chủ" },
  { path: "/add-meal", icon: "add", label: "Thêm bữa ăn" },
  { path: "/participants", icon: "groups", label: "Thành viên" },
  { path: "/restaurants", icon: "restaurant", label: "Quán ăn" },
  { path: "/more", icon: "more_horiz", label: "Khác" },
];

const HIDDEN_PATHS = ["/login", "/auth/callback"];

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (HIDDEN_PATHS.includes(location.pathname)) return null;

  return (
    <div className="fixed bottom-0 w-full max-w-md z-50 bg-surface-container-lowest border-t border-outline-variant pb-safe pb-2 pt-2 px-4">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-16 h-14 transition-all duration-200 active:scale-95 ${
                isActive
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-primary/70"
              }`}
            >
              <div
                className={`flex items-center justify-center w-14 h-8 rounded-full mb-1 ${
                  isActive ? "bg-primary-container/20" : "bg-transparent"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {item.icon}
                </span>
              </div>
              <span
                className={`text-[10px] font-label-sm ${isActive ? "font-bold" : "font-medium"}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
