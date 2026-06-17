import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/format";

interface ParticipantMealCardProps {
  participantName: string;
  onNameChange: (_value: string) => void;
  price: string | number;
  onPriceChange: (_value: string) => void;
  onDelete?: () => void;
  isNewParticipant?: boolean;
  onQuickCreate?: () => void;
  nameError?: boolean;
  amountError?: boolean;
  creating?: boolean;
}

const ParticipantMealCard: React.FC<ParticipantMealCardProps> = ({
  participantName,
  onNameChange,
  price,
  onPriceChange,
  onDelete,
  isNewParticipant,
  onQuickCreate,
  nameError,
  amountError,
  creating,
}) => {
  const { t } = useTranslation();
  const [amountFocused, setAmountFocused] = useState(false);

  const displayAmount = amountFocused
    ? String(price)
    : formatCurrency(String(price));

  return (
    <section className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/30 w-full max-w-md grid grid-cols-[4fr_1fr] gap-4">
      <div className="flex flex-col gap-3 min-w-0">
        <div>
          <label className="text-sm font-medium text-on-surface-variant/80 pl-1">
            {t("participantMealCard.nameLabel")}
          </label>
          <input
            type="text"
            value={participantName}
            onChange={(e) => onNameChange(e.target.value)}
            className={`w-full bg-surface-container-low border focus:border-primary-container focus:ring-0 rounded-xl h-10 px-2 text-body-md text-on-surface outline-none transition-all duration-200 mt-1 ${
              nameError ? "border-error" : "border-outline-variant"
            }`}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-on-surface-variant/80 pl-1">
            {t("participantMealCard.amountLabel")}
          </label>
          <div className="relative flex items-center mt-1">
            <input
              type="text"
              value={displayAmount}
              onChange={(e) =>
                onPriceChange(e.target.value.replace(/[^0-9]/g, ""))
              }
              onFocus={(e) => {
                setAmountFocused(true);
                e.target.select();
              }}
              onBlur={() => setAmountFocused(false)}
              className={`w-full bg-surface-container-low border focus:border-primary-container focus:ring-0 rounded-2xl h-14 pl-4 pr-7 text-body-md text-on-surface transition-all duration-200 outline-none font-medium ${
                amountError ? "border-error" : "border-outline-variant"
              }`}
              placeholder={t("participantMealCard.pricePlaceholder")}
            />
            <span className="absolute right-2 text-on-surface-variant/60 font-normal text-lg pointer-events-none">
              {t("participantMealCard.currency")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 pt-14">
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
        {isNewParticipant && onQuickCreate && (
          <button
            type="button"
            onClick={onQuickCreate}
            disabled={creating}
            className={`p-1.5 rounded-full transition-colors active:scale-95 duration-150 ${
              creating
                ? "text-outline pointer-events-none"
                : "text-primary hover:bg-primary-container/10"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">add</span>
          </button>
        )}
      </div>
    </section>
  );
};

export default ParticipantMealCard;
