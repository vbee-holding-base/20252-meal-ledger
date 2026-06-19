import React from "react";
import { useTranslation } from "react-i18next";

interface RateLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  limit: number | string;
  remaining: number | string;
  retryAfter: number;
}

const RateLimitModal: React.FC<RateLimitModalProps> = ({
  isOpen,
  onClose,
  limit,
  remaining,
  retryAfter,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background w-11/12 max-w-sm rounded-2xl shadow-xl p-6 relative">
        <h2 className="text-xl font-bold mb-4 text-center text-error">
          {t("rateLimit.title", "Rate Limit Exceeded")}
        </h2>

        <div className="space-y-3 mb-6">
          <p className="text-textSecondary text-sm">
            {t(
              "rateLimit.message",
              "You have made too many requests. Please wait before trying again.",
            )}
          </p>
          <div className="bg-surface rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-textSecondary">
                {t("rateLimit.ceiling", "Limit Ceiling:")}
              </span>
              <span className="font-semibold text-text">{limit} requests</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-textSecondary">
                {t("rateLimit.remaining", "Remaining:")}
              </span>
              <span className="font-semibold text-text">{remaining}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-textSecondary">
                {t("rateLimit.retryAfter", "Time until reset:")}
              </span>
              <span className="font-semibold text-error">{retryAfter}s</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {t("common.close", "Close")}
        </button>
      </div>
    </div>
  );
};

export default RateLimitModal;
