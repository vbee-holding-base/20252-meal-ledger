import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// 1. Định nghĩa kiểu dữ liệu (TypeScript Interfaces)
interface MealParticipant {
  id: string;
  name: string;
  itemName: string;
  price: number | string; // Cho phép string để xử lý mượt mà khi người dùng đang gõ
  avatar: string;
}

const AddMealDetail: React.FC = () => {
  const navigate = useNavigate();

  // 2. Khởi tạo State với dữ liệu mẫu từ HTML của bạn
  const [participants, setParticipants] = useState<MealParticipant[]>([
    {
      id: "1",
      name: "Đăng Khánh",
      itemName: "Phở bò tái nạm",
      price: 55000,
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ0YwVQzQyEgR5v4mmhipgm990NHCNLfJZFrdwept-v03FAZ-wMiYxqcGLkHltV-oK2O4eRtOa4IHIJIvtjnFm8cV5JIEPGDDiKyYezYdfjc7ynF7ixrs_b0Hez8-f9nC2F_wDAchiDerZ4ScO92QXwnNzShAbMuKVzH1dKnBpVeYZ-qSgalO13wFysu2cOLtFKyp95jK-2y7Kk5nWx7o34eEy0ZDPmSoalJ8YP3VpVTry_dWd_wuK-QG7xHnrrs6Jb5VaE0_gFBs",
    },
    {
      id: "2",
      name: "Minh Thư",
      itemName: "Bún chả đặc biệt",
      price: 65000,
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBnu90iYMyudj5v_dLNgkhvZYyEXrhOpyxMWKTI2WW_xmW8CNKNvZn6QdEbG9O3rHKEudfa_92fvqCHC19nNTj2WDktbmtIVdWD6iUZU6sgQ1BKVLm1WYrQ8hnB1jwRl254dbWLx-j_ab0cOjAIXFR27aKaCVdA7mhOxMg4rLBohOzPYhYz5e1EKIravl_d1YOEbZlmH81T4ceVwuW5NE7aAD7reNXFPco8O1_pi77XGV0OdZ6ASfW1i0JHjFMOU6ExVRww_7XZ1u4",
    },
    {
      id: "3",
      name: "Hoàng Nam",
      itemName: "Trà đào cam sả",
      price: 35000,
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB1upcPuLlUEO8cUdAxhWLl2UhOlGcksDfGLdLR01upI23FW2ktpjtoPhYKuTKYwDxbIuKI2NyJmektAFxKPOB2T78IatLdR8hFV3fsKNbLnG4Yju__9mji2WOoOe4AV4n3VOSsf0fKWWIp2IggjfYLCCrkdS53OpLpR3oKgfD2wqBnraaWY5gCwtpqyoqmispgm_FfkVWcHLK8FAplQiErex3iwfqrULfmTTmoFe6ummsHbBpw1I1LoK_hMUu1rd04EHceFPAjxYc",
    },
  ]);

  // 3. Hàm xử lý logic cập nhật dữ liệu (State Handlers)
  const handleUpdateField = (
    id: string,
    field: keyof MealParticipant,
    value: string,
  ) => {
    setParticipants((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (field === "price") {
          // Loại bỏ tất cả ký tự không phải số trước khi lưu
          const cleanNumber = value.replace(/\D/g, "");
          return {
            ...item,
            price: cleanNumber === "" ? "" : parseInt(cleanNumber, 10),
          };
        }
        return { ...item, [field]: value };
      }),
    );
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddParticipant = () => {
    const newId = Date.now().toString();
    setParticipants((prev) => [
      ...prev,
      {
        id: newId,
        name: `Thành viên ${prev.length + 1}`,
        itemName: "",
        price: 0,
        avatar: `http://googleusercontent.com/profile/picture/${prev.length}`,
      },
    ]);
  };

  // 4. Tính toán tổng tiền tự động bằng useMemo (Performance Optimization)
  const totalAmount = useMemo(() => {
    return participants.reduce((sum, item) => {
      const priceNum = typeof item.price === "number" ? item.price : 0;
      return sum + priceNum;
    }, 0);
  }, [participants]);

  // Hàm định dạng hiển thị tiền tệ (Ví dụ: 155000 -> "155.000")
  const formatCurrency = (value: number | string) => {
    if (value === "") return "";
    return value.toLocaleString("vi-VN");
  };

  const handleSaveMeal = () => {
    console.log("Dữ liệu bữa ăn sẵn sàng lưu trữ:", participants);
    // Tích hợp lệnh gọi API Backend tại đây
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pb-24 font-headline-xl flex justify-center">
      <div className="w-full max-w-md bg-background min-h-screen relative overflow-x-hidden mx-auto">
        {/* TopAppBar */}
        <header className="fixed top-0 max-w-md mx-auto inset-x-0 w-full z-50 bg-background flex items-center justify-between px-gutter h-16">
          <button
            onClick={() => navigate(-1)}
            className="transition-all duration-200 active:scale-95 hover:bg-primary-container/20 p-2 rounded-full flex items-center justify-center text-primary"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-headline-md flex-1 text-center text-primary-container">
            Thêm bữa ăn
          </h1>
          <button className="transition-all duration-200 active:scale-95 hover:bg-primary-container/20 p-2 rounded-full flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </header>

        {/* Main Canvas */}
        <main className="mt-16 px-gutter pt-6 flex flex-col gap-6 w-full">
          {/* Section Header */}
          <div className="flex items-center gap-sm">
            <div className="w-1.5 h-8 bg-primary-container rounded-full"></div>
            <h2 className="text-headline-md text-on-surface">
              Chi tiết bữa ăn
            </h2>
          </div>

          {/* Participants List */}
          <div className="flex flex-col gap-4">
            {participants.map((p) => (
              <div
                key={p.id}
                className="bg-surface-container-lowest rounded-xl p-md [box-shadow:0_4px_20px_rgba(153,71,0,0.1)] border border-outline-variant/30 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                {/* Participant Header Info */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-sm">
                    <div className="w-8 h-8 rounded-full bg-primary-container/10 overflow-hidden border border-outline-variant/30">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        // 1. Đổi thành onError
                        // 2. Sử dụng e.currentTarget để TypeScript hiểu đây là HTMLImageElement
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <p className="text-label-md text-on-surface">{p.name}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveParticipant(p.id)}
                    className="text-error active:scale-90 transition-transform flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>

                {/* Input Fields Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Tên món ăn */}
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-sm text-on-surface-variant px-1">
                      Tên món ăn
                    </label>
                    <input
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none transition-all text-on-surface text-body-md"
                      placeholder="Ví dụ: Phở bò"
                      type="text"
                      value={p.itemName}
                      onChange={(e) =>
                        handleUpdateField(p.id, "itemName", e.target.value)
                      }
                    />
                  </div>

                  {/* Giá tiền */}
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-sm text-on-surface-variant px-1">
                      Giá tiền (VND)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary-container transition-all">
                      <input
                        className="bg-transparent border-none p-0 focus:ring-0 outline-none text-on-surface text-body-md w-full pr-6"
                        placeholder="0"
                        type="text"
                        value={formatCurrency(p.price)}
                        onChange={(e) =>
                          handleUpdateField(p.id, "price", e.target.value)
                        }
                      />
                      <span className="absolute right-4 text-on-surface-variant text-label-md">
                        đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Member Button */}
            <button
              onClick={handleAddParticipant}
              className="flex items-center justify-center gap-base py-4 border-2 border-dashed border-primary-container/40 rounded-xl text-primary text-label-md hover:bg-primary-container/5 transition-colors squishy-active"
            >
              <span className="material-symbols-outlined">person_add</span>
              Thêm người tham gia
            </button>
          </div>

          {/* Total Summary Card */}
          <div className="bg-primary-container text-on-primary rounded-xl p-md mt-4 shadow-lg flex justify-between items-center text-white">
            <div>
              <p className="text-label-sm text-white/80">Tổng cộng bữa ăn</p>
              <p className="text-headline-md">{formatCurrency(totalAmount)}đ</p>
            </div>
            <div className="text-right">
              <p className="text-label-sm text-white/80">
                {participants.length} người
              </p>
              <div className="flex -space-x-2 mt-1 justify-end">
                {participants.map((p, idx) => (
                  <div
                    key={p.id}
                    className="w-6 h-6 rounded-full border-2 border-primary-container bg-surface-container-high overflow-hidden z-10"
                    style={{ zIndex: 10 - idx }}
                  >
                    <img
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      src={p.avatar}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Actions Container */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto w-full bg-surface-container-lowest p-gutter flex flex-col gap-sm shadow-[0_-4px_20px_rgba(153,71,0,0.1)] z-40">
          <button
            onClick={handleSaveMeal}
            disabled={participants.length === 0}
            className={`w-full py-4 rounded-full text-headline-md flex items-center justify-center gap-base shadow-lg squishy-active transition-all ${
              participants.length > 0
                ? "bg-primary-container text-white cursor-pointer hover:brightness-105"
                : "bg-outline-variant/40 text-on-surface-variant/30 cursor-not-allowed shadow-none"
            }`}
          >
            Lưu bữa ăn
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMealDetail;
