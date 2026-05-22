import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ParticipantManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [targetParticipant, setTargetParticipant] = useState({
    name: "",
    debt: 0,
  });

  const participants = [
    {
      id: "1",
      name: "Việt Anh",
      debt: 100000,
      initial: "A",
      bg: "bg-primary-fixed",
      text: "text-on-primary-fixed",
    },
    {
      id: "2",
      name: "Đăng Khánh",
      debt: 0,
      initial: "B",
      bg: "bg-secondary-fixed",
      text: "text-on-secondary-fixed",
    },
    {
      id: "3",
      name: "Đình Vĩnh",
      debt: 120000,
      initial: "C",
      bg: "bg-tertiary-fixed",
      text: "text-on-tertiary-fixed",
    },
    {
      id: "4",
      name: "Nhật Minh",
      debt: 0,
      initial: "D",
      bg: "bg-outline-variant",
      text: "text-on-surface-variant",
    },
    {
      id: "5",
      name: "Kim Huy",
      debt: 50000,
      initial: "H",
      bg: "bg-primary-fixed-dim",
      text: "text-on-primary-fixed-variant",
    },
  ];

  const handleDeleteClick = (name: string, debt: number) => {
    setTargetParticipant({ name, debt });
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="bg-background text-on-surface min-h-screen pb-24">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full max-w-md z-50 flex items-center justify-between px-margin-mobile h-16 bg-surface">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary-container/10 transition-colors active:scale-95 duration-200"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined text-primary">
            arrow_back
          </span>
        </button>
        <h1
          className="absolute inset-0 flex items-center justify-center font-headline-md text-headline-md pointer-events-none"
          style={{ color: "#ff7a00" }}
        >
          Người tham gia
        </h1>
        <div className="w-10"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mt-16 pb-32">
        {/* Search Bar */}
        <section className="px-margin-mobile sticky bg-surface z-40 pt-1 pb-2 top-12">
          <div className="relative">
            <span className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-on-surface-variant right-4">
              search
            </span>
            <input
              className="w-full h-12 pr-4 rounded-xl border-none bg-surface-container-low text-body-md font-body-md focus:ring-2 focus:ring-primary transition-all placeholder:text-outline pl-4"
              placeholder="Tìm kiếm tên người tham gia..."
              type="text"
            />
          </div>
        </section>

        <section className="px-margin-mobile pb-4">
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <input
                className="w-full h-12 px-4 rounded-xl border-none bg-surface-container-low text-body-md font-body-md focus:ring-2 focus:ring-primary transition-all placeholder:text-outline"
                placeholder="Tên người dùng"
                type="text"
              />
            </div>
            <button
              className="w-full max-w-[3rem] h-12 bg-primary-container text-on-primary rounded-xl flex items-center justify-center active:scale-95 transition-transform"
              onClick={() => setIsAddModalOpen(true)}
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </section>

        {/* Participants List */}
        <section className="px-margin-mobile flex flex-col gap-3">
          {/* List Header */}
          <div className="flex items-center justify-between py-2">
            <h2 className="text-label-md font-label-md text-on-surface-variant">
              Tất cả người tham gia ({participants.length})
            </h2>
            <button className="text-primary font-label-sm text-label-sm flex items-center gap-1">
              Sắp xếp
              <span className="material-symbols-outlined text-base leading-none ml-1">
                unfold_more
              </span>
            </button>
          </div>

          {/* Participant Items */}
          <div className="flex flex-col gap-4">
            {participants.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(153,71,0,0.06)] active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full ${p.bg} flex items-center justify-center ${p.text} font-bold text-headline-md`}
                  >
                    {p.initial}
                  </div>
                  <div>
                    <p className="font-body-md text-body-md font-bold text-on-surface">
                      {p.name}
                    </p>
                    {p.debt > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error-container text-error text-label-sm">
                        {p.debt.toLocaleString("vi-VN")}đ
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-tertiary text-label-sm">
                        0đ
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    className="p-2 text-on-surface-variant hover:text-error transition-colors"
                    onClick={() => handleDeleteClick(p.name, p.debt)}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Add Participant Modal (Bottom Sheet Style) */}
      <div
        className={`${isAddModalOpen ? "flex" : "hidden"} fixed inset-0 z-[60] items-end`}
      >
        <div
          className="modal-overlay absolute inset-0"
          onClick={() => setIsAddModalOpen(false)}
        ></div>
        <div
          className={`bg-surface-container-lowest w-full rounded-t-[32px] p-xl relative shadow-2xl transition-transform transform ${isAddModalOpen ? "translate-y-0" : "translate-y-full"} animate-slide-up`}
        >
          <div className="w-12 h-1.5 bg-outline-variant rounded-full mx-auto mb-8"></div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-6">
            Thêm người tham gia
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-label-md font-label-md text-on-surface-variant">
                Tên hoặc Biệt danh
              </label>
              <input
                className="w-full h-14 px-4 rounded-2xl border-2 border-surface-container-high focus:border-primary focus:ring-0 text-body-md transition-all"
                placeholder="Nhập tên..."
                type="text"
              />
            </div>
            <div className="flex gap-4">
              <button
                className="flex-1 h-14 rounded-full border-2 border-primary text-primary font-bold active:scale-95 transition-transform"
                onClick={() => setIsAddModalOpen(false)}
              >
                Hủy
              </button>
              <button
                className="flex-1 h-14 rounded-full bg-primary-container text-on-primary font-bold shadow-md active:scale-95 transition-transform"
                onClick={() => setIsAddModalOpen(false)}
              >
                Lưu
              </button>
            </div>
          </div>
          <div className="safe-area-bottom h-8"></div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div
        className={`${isDeleteModalOpen ? "flex" : "hidden"} fixed inset-0 z-[70] items-center justify-center px-margin-mobile`}
      >
        <div
          className="modal-overlay absolute inset-0"
          onClick={() => setIsDeleteModalOpen(false)}
        ></div>
        <div className="bg-surface-container-lowest w-full max-w-sm rounded-[24px] p-md relative shadow-2xl overflow-hidden">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-error-container text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">
                warning
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface">
              Bạn có chắc muốn xóa?
            </h3>
            <p className="text-body-md text-on-surface-variant">
              Xóa thành viên <strong>{targetParticipant.name}</strong> khỏi
              nhóm.
            </p>
            {/* Warning for debt */}
            {targetParticipant.debt > 0 && (
              <div className="flex items-start gap-3 p-3 bg-error-container/30 rounded-xl text-error text-left w-full">
                <span className="material-symbols-outlined text-sm">info</span>
                <p className="text-label-sm font-label-sm">
                  Người này vẫn còn nợ{" "}
                  <strong>{targetParticipant.debt / 1000}k</strong>. Xóa sẽ làm
                  mất dữ liệu khoản nợ này.
                </p>
              </div>
            )}
            <div className="flex flex-col w-full gap-3 mt-4">
              <button
                className="w-full h-12 rounded-full bg-error text-on-error font-bold active:scale-95 transition-transform"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Xóa
              </button>
              <button
                className="w-full h-12 rounded-full text-on-surface-variant font-bold active:scale-95 transition-transform"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantManagement;
