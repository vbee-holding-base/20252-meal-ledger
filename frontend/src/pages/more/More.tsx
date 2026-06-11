import React from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "../../components/layout/TopAppBar";

const moreItems = [
  {
    path: "/more/bank-account",
    icon: "account_balance",
    title: "Tài khoản ngân hàng",
    subtitle: "Quản lý thông tin tài khoản ngân hàng",
    bg: "bg-primary-container/10",
    textColor: "text-primary-container",
    hoverBg: "group-hover:bg-primary-container",
  },
  {
    path: "/more/general-settings",
    icon: "settings",
    title: "Cài đặt chung",
    subtitle: "Đơn vị tiền tệ, ngôn ngữ, thông báo",
    bg: "bg-tertiary-fixed",
    textColor: "text-tertiary",
    hoverBg: "group-hover:bg-tertiary",
  },
  {
    path: "/more/help",
    icon: "help",
    title: "Trợ giúp",
    subtitle: "Hướng dẫn sử dụng và liên hệ",
    bg: "bg-secondary-fixed",
    textColor: "text-secondary",
    hoverBg: "group-hover:bg-secondary-container",
  },
];

const More: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-surface min-h-screen pb-24">
      <TopAppBar title="Khác" showBack={false} />

      <main className="flex-1 mt-16 px-margin-mobile pt-4 space-y-4 max-w-md mx-auto w-full">
        {moreItems.map((item) => (
          <button
            key={item.path}
            className="w-full text-left bg-surface-container-lowest p-md rounded-xl card-shadow border border-outline-variant/30 squishy-active group transition-all duration-300 hover:border-primary-container flex items-center gap-4"
            onClick={() => navigate(item.path)}
          >
            <div
              className={`w-14 h-14 ${item.bg} rounded-full flex items-center justify-center ${item.hoverBg} transition-all duration-300`}
            >
              <span
                className={`material-symbols-outlined ${item.textColor} group-hover:text-white text-[32px] transition-all duration-300`}
              >
                {item.icon}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-headline-md text-on-surface text-[20px]">
                {item.title}
              </h3>
              <p className="text-on-surface-variant font-label-sm">
                {item.subtitle}
              </p>
            </div>
            <span className="material-symbols-outlined text-outline">
              chevron_right
            </span>
          </button>
        ))}
      </main>
    </div>
  );
};

export default More;
