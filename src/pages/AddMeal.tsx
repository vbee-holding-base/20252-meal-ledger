import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddMeal: React.FC = () => {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([
    { id: "1", name: "", item: "", price: "" },
    { id: "2", name: "", item: "", price: "" },
  ]);

  const addParticipant = () => {
    setParticipants([
      ...participants,
      { id: Date.now().toString(), name: "", item: "", price: "" },
    ]);
  };

  const removeParticipant = (idToRemove: string) => {
    setParticipants(participants.filter((p) => p.id !== idToRemove));
  };

  return (
    <div className="bg-background text-on-surface min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full max-w-md flex items-center px-gutter h-16 bg-background z-50">
        <button
          className="absolute left-gutter p-2 transition-all duration-200 active:scale-95 hover:bg-primary-container/20 rounded-full"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined text-primary">
            arrow_back
          </span>
        </button>
        <div className="flex-1 text-center">
          <h1 className="font-headline-md font-bold text-headline-md text-[#ff7a00]">
            Thêm bữa ăn
          </h1>
        </div>
      </header>

      <main className="pt-20 px-margin-mobile max-w-md mx-auto space-y-6">
        {/* Quick Input Section */}
        <section>
          <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_20px_rgba(153,71,0,0.1)]">
            <label className="block font-label-md text-on-surface-variant mb-2 font-bold">
              Nhập nhanh thông tin
            </label>
            <textarea
              className="w-full min-h-[120px] p-md rounded-xl border-2 border-outline-variant focus:border-primary-container focus:ring-0 text-body-md transition-colors placeholder:text-outline"
              placeholder="Nhập mô tả nhanh (Thời gian, ai ăn món gì, giá bao nhiêu, tổng tiền...)"
            ></textarea>
          </div>
        </section>

        {/* Common Time Section */}
        <section>
          <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_20px_rgba(153,71,0,0.1)] flex items-center gap-4">
            <div className="bg-primary-container/10 p-3 rounded-full text-primary">
              <span className="material-symbols-outlined">schedule</span>
            </div>
            <div className="flex-1">
              <label className="block font-label-md text-on-surface-variant">
                Thời gian
              </label>
              <input
                className="w-full bg-transparent border-none focus:ring-0 p-0 text-body-lg font-semibold text-on-surface"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
        </section>

        {/* Detailed List Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
              Chi tiết bữa ăn
            </h2>
            <span className="text-label-md font-bold text-primary-container">
              {participants.length} người
            </span>
          </div>

          <div className="space-y-4">
            {participants.map((p, index) => (
              <div
                key={p.id}
                className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_20px_rgba(153,71,0,0.1)] relative animate-in slide-in-from-bottom-2 duration-300"
              >
                {index > 0 && (
                  <button
                    onClick={() => removeParticipant(p.id)}
                    className="absolute -top-2 -right-2 bg-error-container text-on-error-container w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      close
                    </span>
                  </button>
                )}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="font-label-sm text-on-surface-variant ml-1">
                      Người tham gia
                    </label>
                    <div className="flex items-center gap-2 border-2 border-outline-variant rounded-xl px-4 py-2 focus-within:border-primary-container transition-colors">
                      <span className="material-symbols-outlined text-primary-container/60">
                        person
                      </span>
                      <input
                        className="w-full border-none focus:ring-0 p-0 text-body-md bg-transparent"
                        placeholder="Tên người tham gia"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-label-sm text-on-surface-variant ml-1">
                        Món ăn
                      </label>
                      <div className="flex items-center gap-2 border-2 border-outline-variant rounded-xl px-4 py-2 focus-within:border-primary-container transition-colors">
                        <span className="material-symbols-outlined text-primary-container/60">
                          restaurant
                        </span>
                        <input
                          className="w-full border-none focus:ring-0 p-0 text-body-md bg-transparent"
                          placeholder="Món ăn..."
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-sm text-on-surface-variant ml-1">
                        Giá tiền
                      </label>
                      <div className="flex items-center gap-2 border-2 border-outline-variant rounded-xl px-4 py-2 focus-within:border-primary-container transition-colors">
                        <span className="material-symbols-outlined text-primary-container/60">
                          payments
                        </span>
                        <input
                          className="w-full border-none focus:ring-0 p-0 text-body-md bg-transparent text-right"
                          placeholder="0"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add More Button */}
          <button
            onClick={addParticipant}
            className="w-full py-4 border-2 border-dashed border-primary-container/40 rounded-xl flex items-center justify-center gap-2 text-primary-container font-label-md hover:bg-primary-container/10 transition-colors active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Thêm người tham gia
          </button>
        </section>
      </main>

      {/* Floating Save Button */}
      <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto z-40 bg-gradient-to-t from-background to-transparent pt-12 pb-24 px-margin-mobile">
        <div className="max-w-md mx-auto">
          <button className="w-full py-4 bg-primary-container text-white rounded-full font-headline-md text-headline-md shadow-lg shadow-primary-container/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              save
            </span>
            Lưu bữa ăn
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMeal;
