import React, { useState } from "react";

import logo from "../assets/logo.png";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api/v1";

const Login: React.FC = () => {
  const [searchName, setSearchName] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSearch = () => {
    if (searchName.trim() !== "") {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } else {
      // Small visual feedback for error could be added here
      const inputField = document.getElementById("name-search-input");
      if (inputField) {
        inputField.focus();
        inputField.classList.add("border-error");
        setTimeout(() => inputField.classList.remove("border-error"), 500);
      }
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center px-margin-mobile py-lg">
        <div className="w-full max-w-[440px] flex flex-col items-center text-center">
          {/* Branding Header */}
          <header className="mb-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative mb-md flex justify-center">
              <div className="w-24 h-24 rounded-full bg-primary-container/10 flex items-center justify-center overflow-hidden">
                <img
                  alt="LunchSplit Logo"
                  className="w-20 h-20 object-contain"
                  src={logo}
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -top-2 -right-2 bg-secondary-container p-2 rounded-full shadow-lg">
                <span
                  className="material-symbols-outlined text-on-secondary-container"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  restaurant
                </span>
              </div>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight mb-2">
              LunchSplit
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant px-md">
              Quản lý tiền ăn trưa và công nợ dễ dàng
            </p>
          </header>

          {/* Interaction Card */}
          <section className="w-full bg-surface-container-lowest rounded-xl p-md login-card-shadow animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            {/* Owner Login (Google) */}
            <div className="relative pt-4 pb-2 mb-4">
              <label className="absolute -top-3 left-4 px-base bg-surface-container-lowest text-label-sm text-primary font-bold uppercase tracking-wider">
                Chủ nhóm
              </label>
              <div className="border-2 border-outline-variant/30 rounded-xl p-md">
                <a
                  className="w-full h-14 bg-surface-container-lowest border border-outline-variant rounded-full flex items-center justify-center gap-base font-label-md text-label-md text-on-surface-variant squishy-active hover:bg-surface-container-low transition-colors"
                  href={`${API_BASE_URL}/auth/google`}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    ></path>
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    ></path>
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    ></path>
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    ></path>
                  </svg>
                  <span>Đăng nhập với Google</span>
                </a>
              </div>
            </div>

            {/* Participant Search Section */}
            <div className="relative pt-4">
              <label className="absolute -top-3 left-4 px-base bg-surface-container-lowest text-label-sm text-primary font-bold uppercase tracking-wider">
                Thành viên
              </label>
              <div className="border-2 border-outline-variant/30 rounded-xl p-md space-y-gutter">
                <div className="relative group">
                  <label className="absolute -top-2.5 left-4 px-base bg-surface-container-lowest text-label-sm text-primary font-semibold transition-all group-focus-within:text-primary-container">
                    Tên của bạn
                  </label>
                  <input
                    id="name-search-input"
                    className="w-full h-14 bg-transparent border-2 border-outline-variant rounded-xl px-md font-body-md text-on-surface placeholder:text-outline/50 focus:border-primary-container focus:ring-0 transition-all outline-none"
                    placeholder="VD: Nguyễn Văn A"
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                  <span className="material-symbols-outlined absolute right-4 top-4 text-outline group-focus-within:text-primary-container transition-colors">
                    person_search
                  </span>
                </div>
                <button
                  className="w-full h-14 bg-primary-container text-on-primary font-label-md text-label-md rounded-full shadow-lg hover:bg-primary transition-all flex items-center justify-center gap-base squishy-active"
                  onClick={handleSearch}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    account_balance_wallet
                  </span>
                  <span>Tra cứu công nợ</span>
                </button>
              </div>
            </div>
          </section>

          {/* Visual Decoration / Footer */}
          <footer className="mt-xl text-center">
            <p className="font-label-sm text-label-sm text-outline">
              © 2026 LunchSplit Team
            </p>
          </footer>
        </div>
      </main>

      {/* Success Feedback (Hidden by default) */}
      <div
        className={`fixed bottom-margin-mobile left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-md py-base rounded-full font-label-md text-label-md shadow-xl transition-all duration-300 z-[100] pointer-events-none ${
          showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        id="toast"
      >
        Đang tìm kiếm thông tin của bạn...
      </div>
    </div>
  );
};

export default Login;
