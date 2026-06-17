import React from "react";
import { useTranslation } from "react-i18next";

interface ParticipantMealCardProps {
  participantName: string;
  dishName: string;
  price: string | number;
  onDishNameChange: (_value: string) => void;
  onPriceChange: (_value: string) => void;
  onDelete?: () => void;
}

const ParticipantMealCard: React.FC<ParticipantMealCardProps> = ({
  participantName,
  dishName,
  price,
  onDishNameChange,
  onPriceChange,
  onDelete,
}) => {
  const { t } = useTranslation();
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
            className="text-error hover:bg-error-container/10 p-1.5 rounded-full transition-colors active:scale-95 duration-150"
          >
            <span className="material-symbols-outlined text-[22px]">
              delete
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-on-surface-variant/80 pl-1">
          {t("participantMealCard.dishLabel")}
        </label>
        <input
          type="text"
          value={dishName}
          onChange={(e) => onDishNameChange(e.target.value)}
          className="w-full bg-surface-container-low border border-transparent focus:border-primary-container focus:ring-0 rounded-2xl h-14 px-4 text-body-md text-on-surface transition-all duration-200 outline-none"
          placeholder={t("participantMealCard.dishPlaceholder")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-on-surface-variant/80 pl-1">
          {t("participantMealCard.priceLabel")}
        </label>
        <div className="relative flex items-center">
          <input
            type="text"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            className="w-full bg-surface-container-low border border-transparent focus:border-primary-container focus:ring-0 rounded-2xl h-14 pl-4 pr-10 text-body-md text-on-surface transition-all duration-200 outline-none font-medium"
            placeholder={t("participantMealCard.pricePlaceholder")}
          />
          <span className="absolute right-4 text-on-surface-variant/60 font-normal text-lg pointer-events-none">
            {t("participantMealCard.currency")}
          </span>
        </div>
      </div>
    </section>
  );
};

export default ParticipantMealCard;
