import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddMealQuick: React.FC = () => {
  const navigate = useNavigate();
  const [rawText, setRawText] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleParse = () => {
    if (!rawText.trim()) return;
    console.log("Dữ liệu thô gửi đi phân tích:", rawText);
  };

  return (
    <div className="bg-background text-on-surface min-h-screen selection:bg-primary-container/30 font-headline-xl flex justify-center">
      <div className="w-full max-w-md bg-background min-h-screen relative overflow-x-hidden">
        <header className="fixed top-0 left-0 right-0 h-16 bg-background flex items-center justify-between px-gutter z-50 w-full max-w-md mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 transition-all duration-200 active:scale-90 hover:bg-primary-container/20 rounded-full text-primary"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>

          <h1 className="text-headline-md flex-1 text-center text-primary-container">
            Thêm bữa ăn
          </h1>

          <button className="flex items-center justify-center w-10 h-10 transition-all duration-200 active:scale-90 hover:bg-primary-container/20 rounded-full text-on-surface-variant">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </header>
        <main className="pt-20 pb-md px-margin-mobile min-h-screen flex flex-col gap-md">
          <section
            className={`bg-surface-container-lowest rounded-xl p-md border border-outline-variant/30 transition-all duration-300 shadow-[0_4px_20px_rgba(153,71,0,0.1)] ${
              isFocused ? "ring-2 ring-primary-container/20" : ""
            }`}
          >
            <div className="flex items-center gap-sm mb-base">
              <span className="material-symbols-outlined text-primary">
                edit_note
              </span>
              <h2 className="text-headline-md text-on-surface">
                Nhập nhanh thông tin
              </h2>
            </div>

            <p className="text-body-md text-on-surface-variant mb-md">
              Nhập danh sách món ăn và giá (ví dụ: Phở bò 50k, Coca 15k...)
            </p>

            <div className="relative group">
              <textarea
                className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary-container focus:ring-0 rounded-xl p-md text-body-md placeholder:text-on-surface-variant/40 transition-all duration-300 outline-none resize-none"
                placeholder={"Ví dụ:\nBún chả 45k\nTrà đá 5k\nNem chua 20k"}
                rows={8}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </div>
          </section>

          <div className="w-full">
            <button
              onClick={handleParse}
              disabled={!rawText.trim()}
              className={`w-full h-14 rounded-full text-headline-md flex items-center justify-center gap-base shadow-lg transition-all duration-150 active:scale-95 ${
                rawText.trim()
                  ? "bg-primary-container hover:brightness-110 text-on-primary cursor-pointer shadow-primary-container/20"
                  : "bg-outline-variant/40 text-on-surface-variant/30 cursor-not-allowed shadow-none"
              }`}
            >
              <span>Phân tích</span>
              <span className="material-symbols-outlined">check_circle</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddMealQuick;
