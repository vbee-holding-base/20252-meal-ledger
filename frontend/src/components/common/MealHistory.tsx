import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "../../utils/format";

export interface MealHistoryItem {
  restaurantName: string;
  date: string;
  amount: number;
  status: string;
}

interface MealHistoryProps {
  history: MealHistoryItem[];
}

const MealHistory: React.FC<MealHistoryProps> = ({ history }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"unpaid" | "paid">("unpaid");

  const unpaidMeals = history.filter(
    (item) => item.status === "unpaid" || item.status === "uncomplete",
  );
  const paidMeals = history.filter((item) => item.status === "paid");

  const displayedMeals = activeTab === "unpaid" ? unpaidMeals : paidMeals;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unpaid":
        return (
          <span className="inline-flex items-center rounded-md bg-error-container/30 px-2 py-0.5 text-[11px] font-bold text-error">
            {t("debtDetails.statusUnpaid")}
          </span>
        );
      case "uncomplete":
        return (
          <span className="inline-flex items-center rounded-md bg-warning-container/30 px-2 py-0.5 text-[11px] font-bold text-warning-fixed-dim">
            {t("debtDetails.statusUncomplete")}
          </span>
        );
      case "paid":
        return (
          <span className="inline-flex items-center rounded-md bg-tertiary-container/30 px-2 py-0.5 text-[11px] font-bold text-tertiary">
            {t("debtDetails.statusPaid")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-surface-container px-2 py-0.5 text-[11px] font-bold text-on-surface-variant">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex bg-surface-container-high p-1 rounded-full w-full">
        <button
          className={`flex-1 py-2 rounded-full font-label-md text-label-md transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === "unpaid"
              ? "bg-primary text-on-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
          onClick={() => setActiveTab("unpaid")}
        >
          <span>{t("debtDetails.unpaidTab")}</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "unpaid"
                ? "bg-on-primary/20 text-on-primary"
                : "bg-surface-container-highest text-on-surface-variant"
            }`}
          >
            {unpaidMeals.length}
          </span>
        </button>
        <button
          className={`flex-1 py-2 rounded-full font-label-md text-label-md transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === "paid"
              ? "bg-primary text-on-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
          onClick={() => setActiveTab("paid")}
        >
          <span>{t("debtDetails.paidTab")}</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "paid"
                ? "bg-on-primary/20 text-on-primary"
                : "bg-surface-container-highest text-on-surface-variant"
            }`}
          >
            {paidMeals.length}
          </span>
        </button>
      </div>

      <div className="space-y-4 mb-xl">
        {displayedMeals.length === 0 ? (
          <div className="rounded-3xl border border-outline-variant p-6 text-center text-on-surface-variant animate-in fade-in duration-300">
            {t("debtDetails.noHistory")}
          </div>
        ) : (
          displayedMeals.map((tx, idx) => (
            <div
              key={`${tx.restaurantName}-${tx.date}-${tx.amount}-${idx}`}
              className="bg-surface-container-lowest p-md rounded-xl login-card-shadow flex items-center gap-4 group transition-all hover:translate-x-1 animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined">restaurant</span>
              </div>
              <div className="flex-1 flex justify-between items-center gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-label-md text-label-md text-on-background">
                      {tx.restaurantName}
                    </h4>
                    {getStatusBadge(tx.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
                      calendar_today
                    </span>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      {formatDateTime(tx.date)}
                    </p>
                  </div>
                </div>
                <span className="font-label-md text-label-md text-primary text-right whitespace-nowrap">
                  {tx.amount.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MealHistory;
