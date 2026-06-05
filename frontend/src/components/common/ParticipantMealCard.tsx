import React from "react";

interface ParticipantMealCardProps {
  participantName: string;
  dishName: string;
  price: string | number;
  onDishNameChange: (_value: string) => void; // Hàm xử lý khi gõ tên món
  onPriceChange: (_value: string) => void; // Hàm xử lý khi gõ giá tiền
  onDelete?: () => void; // Hàm xử lý khi bấm nút xóa (Thùng rác)
}

const ParticipantMealCard: React.FC<ParticipantMealCardProps> = ({
  participantName,
  dishName,
  price,
  onDishNameChange,
  onPriceChange,
  onDelete,
}) => {
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/30 w-full max-w-md flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-on-surface text-base">
          {participantName}
        </span>

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="text-[#ba1a1a] hover:bg-error-container/10 p-1.5 rounded-full transition-colors active:scale-95 duration-150"
          >
            <span className="material-symbols-outlined text-[22px]">
              delete
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-on-surface-variant/80 pl-1">
          Tên món ăn
        </label>
        <input
          type="text"
          value={dishName}
          onChange={(e) => onDishNameChange(e.target.value)}
          className="w-full bg-surface-container-low border border-transparent focus:border-primary-container focus:ring-0 rounded-2xl h-14 px-4 text-body-md transition-all duration-200 outline-none"
          placeholder="Nhập tên món ăn..."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-on-surface-variant/80 pl-1">
          Giá tiền (VND)
        </label>
        <div className="relative flex items-center">
          <input
            type="text"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            className="w-full bg-surface-container-low border border-transparent focus:border-primary-container focus:ring-0 rounded-2xl h-14 pl-4 pr-10 text-body-md transition-all duration-200 outline-none font-medium"
            placeholder="0"
          />
          <span className="absolute right-4 text-on-surface-variant/60 font-normal text-lg pointer-events-none">
            đ
          </span>
        </div>
      </div>
    </section>
  );
};

export default ParticipantMealCard;
