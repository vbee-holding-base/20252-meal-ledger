import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      const header = document.querySelector("header");
      if (header) {
        if (currentScroll > 50) {
          header.classList.add("shadow-md", "bg-white/90", "backdrop-blur-md");
        } else {
          header.classList.remove(
            "shadow-md",
            "bg-white/90",
            "backdrop-blur-md",
          );
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-24 font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full max-w-md z-50 flex items-center justify-between px-margin-mobile h-16 bg-surface/80 backdrop-blur-md transition-all duration-300">
        <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">
          LunchSplit
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center hover:bg-error hover:text-on-error transition-colors duration-300"
            title="Đăng xuất"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="pt-20 px-margin-mobile min-h-screen space-y-6 max-w-md mx-auto">
        {/* Action Cards Grid */}
        <div className="space-y-4">
          {/* Card 1: Add Meal */}
          <button
            className="w-full text-left bg-surface-container-lowest p-md rounded-xl card-shadow border border-outline-variant/30 squishy-active group transition-all duration-300 hover:border-primary-container flex items-center gap-4"
            onClick={() => navigate("/add-meal")}
          >
            <div className="w-14 h-14 bg-primary-container/10 rounded-full flex items-center justify-center group-hover:bg-primary-container transition-colors duration-300">
              <span className="material-symbols-outlined text-primary-container group-hover:text-white text-[32px]">
                restaurant
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-headline-md text-on-surface text-[20px]">
                Thêm bữa ăn
              </h3>
              <p className="text-on-surface-variant font-label-sm">
                Bắt đầu chia hóa đơn bữa trưa nay
              </p>
            </div>
            <span className="material-symbols-outlined text-outline">
              chevron_right
            </span>
          </button>

          {/* Card 2: Participants */}
          <button
            className="w-full text-left bg-surface-container-lowest p-md rounded-xl card-shadow border border-outline-variant/30 squishy-active group transition-all duration-300 hover:border-primary-container flex items-center gap-4"
            onClick={() => navigate("/participants")}
          >
            <div className="w-14 h-14 bg-tertiary-fixed rounded-full flex items-center justify-center group-hover:bg-tertiary transition-colors duration-300">
              <span className="material-symbols-outlined text-tertiary group-hover:text-white text-[32px]">
                groups
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-headline-md text-on-surface text-[20px]">
                Quản lý người tham gia
              </h3>
              <p className="text-on-surface-variant font-label-sm">
                Xem và chỉnh sửa danh sách bạn bè
              </p>
            </div>
            <span className="material-symbols-outlined text-outline">
              chevron_right
            </span>
          </button>

          {/* Card 3: Restaurants */}
          <button
            className="w-full text-left bg-surface-container-lowest p-md rounded-xl card-shadow border border-outline-variant/30 squishy-active group transition-all duration-300 hover:border-primary-container flex items-center gap-4"
            onClick={() => navigate("/restaurants")}
          >
            <div className="w-14 h-14 bg-secondary-fixed rounded-full flex items-center justify-center group-hover:bg-secondary-container transition-colors duration-300">
              <span className="material-symbols-outlined text-secondary group-hover:text-on-secondary-container text-[32px]">
                store
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-headline-md text-on-surface text-[20px]">
                Quản lý quán ăn
              </h3>
              <p className="text-on-surface-variant font-label-sm">
                Lưu lại những quán ngon đã ghé
              </p>
            </div>
            <span className="material-symbols-outlined text-outline">
              chevron_right
            </span>
          </button>
        </div>

        {/* Recent Activity Mini Section */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-headline-md text-[18px] text-on-background">
              Hoạt động gần đây
            </h4>
            <button className="text-primary font-label-md hover:underline">
              Xem tất cả
            </button>
          </div>
          <div className="bg-surface-container-low rounded-xl p-sm space-y-3">
            <div className="flex items-center justify-between p-base bg-surface-container-lowest rounded-lg border border-outline-variant/20">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container">
                  lunch_dining
                </span>
                <div>
                  <p className="font-label-md text-on-surface">
                    Cơm Tấm Kim Huy
                  </p>
                  <p className="text-[10px] text-on-surface-variant">
                    Thứ Ba, 21/05
                  </p>
                </div>
              </div>
              <p className="font-headline-md text-[14px] text-primary">
                120.000đ
              </p>
            </div>

            <div className="flex items-center justify-between p-base bg-surface-container-lowest rounded-lg border border-outline-variant/20">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary">
                  payments
                </span>
                <div>
                  <p className="font-label-md text-on-surface">Phở Sinh Tử</p>
                  <p className="text-[10px] text-on-surface-variant">
                    Thứ Ba, 21/05
                  </p>
                </div>
              </div>
              <p className="font-headline-md text-[14px] text-tertiary">
                250.000đ
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
