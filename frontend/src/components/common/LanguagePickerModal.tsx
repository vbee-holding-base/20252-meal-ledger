import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";

const LANGUAGES = [
  { code: "vi", labelKey: "language.vi" },
  { code: "en", labelKey: "language.en" },
];

interface LanguagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguagePickerModal: React.FC<LanguagePickerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  if (!isOpen) return null;

  const handleSelect = (code: string) => {
    setLanguage(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-margin-mobile">
      <div className="modal-overlay absolute inset-0" onClick={onClose} />
      <div className="bg-surface-container-lowest w-full max-w-sm rounded-[24px] p-md relative shadow-2xl overflow-hidden">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px]">
              translate
            </span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface">
            {t("generalSettings.languagePickerTitle")}
          </h3>
        </div>

        <div className="mt-6 space-y-2">
          {LANGUAGES.map((lang) => {
            const isActive = language === lang.code;
            return (
              <button
                key={lang.code}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                  isActive
                    ? "bg-primary-container/20 border border-primary/30"
                    : "hover:bg-surface-container border border-transparent"
                }`}
                onClick={() => handleSelect(lang.code)}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isActive ? "border-primary" : "border-outline-variant"
                  }`}
                >
                  {isActive && (
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
                <span
                  className={`font-body-md ${
                    isActive ? "text-primary font-semibold" : "text-on-surface"
                  }`}
                >
                  {t(lang.labelKey)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <button
            className="w-full h-12 rounded-full border border-outline-variant text-on-surface-variant font-bold active:scale-95 transition-transform"
            onClick={onClose}
          >
            {t("generalSettings.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguagePickerModal;
