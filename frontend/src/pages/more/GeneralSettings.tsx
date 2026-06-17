import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TopAppBar from "../../components/layout/TopAppBar";
import SettingRow from "../../components/common/SettingRow";
import LanguagePickerModal from "../../components/common/LanguagePickerModal";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

const GeneralSettings: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const { language } = useLanguage();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="bg-background text-on-surface min-h-screen pb-24">
      <TopAppBar title={t("generalSettings.title")} showBack={true} />
      <main className="flex-1 mt-16 px-margin-mobile pt-4 space-y-4 max-w-md mx-auto w-full">
        <SettingRow
          icon={isDark ? "dark_mode" : "light_mode"}
          title={
            isDark
              ? t("generalSettings.darkMode")
              : t("generalSettings.lightMode")
          }
          color="blue"
          type="toggle"
          toggled={isDark}
          onToggle={toggle}
        />
        <SettingRow
          icon="translate"
          title={t("generalSettings.language")}
          color="yellow"
          type="button"
          buttonLabel={t(`language.${language}`)}
          onAction={() => setShowLanguagePicker(true)}
        />
        <SettingRow
          icon="logout"
          title={t("generalSettings.logout")}
          color="red"
          type="button"
          buttonLabel={t("generalSettings.logout")}
          onAction={handleLogout}
        />
      </main>
      <LanguagePickerModal
        isOpen={showLanguagePicker}
        onClose={() => setShowLanguagePicker(false)}
      />
    </div>
  );
};

export default GeneralSettings;
