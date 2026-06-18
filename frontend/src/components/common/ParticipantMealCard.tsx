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
    <section className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/30 w-full max-w-md">
      <label className="text-sm font-medium text-on-surface-variant/80 pl-1">
        {t("participantMealCard.nameLabel")}
      </label>
      <input
        type="text"
        value={participantName}
        onChange={(e) => onNameChange(e.target.value)}
        className={`w-full bg-surface-container-low border focus:border-primary-container focus:ring-0 rounded-xl h-14 px-4 text-body-md text-on-surface outline-none transition-all duration-200 mt-1 ${
          nameError ? "border-error" : "border-outline-variant"
        }`}
      />

      <label className="text-sm font-medium text-on-surface-variant/80 pl-1 mt-4 block">
        {t("participantMealCard.amountLabel")}
      </label>
      <div className="relative flex items-center mt-1">
        <input
          type="text"
          value={displayAmount}
          onChange={(e) => onPriceChange(e.target.value.replace(/[^0-9]/g, ""))}
          onFocus={(e) => {
            setAmountFocused(true);
            e.target.select();
          }}
          onBlur={() => setAmountFocused(false)}
          className={`w-full bg-surface-container-low border focus:border-primary-container focus:ring-0 rounded-2xl h-14 pl-4 pr-4 text-body-md text-on-surface transition-all duration-200 outline-none font-medium ${
            amountError ? "border-error" : "border-outline-variant"
          }`}
          placeholder={t("participantMealCard.pricePlaceholder")}
        />
      </div>

      <div className="flex items-center justify-between pt-3 mt-4 border-t border-outline-variant/30">
        <button
          type="button"
          onClick={onDelete}
          className="px-4 py-2 rounded-xl border border-error text-error text-sm font-medium hover:bg-error/5 active:scale-95 transition-all"
        >
          {t("participantMealCard.delete")}
        </button>
        <button
          type="button"
          onClick={isNewParticipant ? onQuickCreate : undefined}
          disabled={!isNewParticipant || creating}
          className={`px-4 py-2 rounded-xl border text-sm font-medium active:scale-95 transition-all ${
            isNewParticipant
              ? "border-primary text-primary hover:bg-primary/5 cursor-pointer"
              : "border-outline text-outline cursor-not-allowed"
          } ${creating ? "opacity-50" : ""}`}
        >
          {creating ? "..." : t("participantMealCard.quickCreate")}
        </button>
      </div>
    </section>
  );
};

export default ParticipantMealCard;
