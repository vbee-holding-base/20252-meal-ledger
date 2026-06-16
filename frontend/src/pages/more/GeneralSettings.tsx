import React from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "../../components/layout/TopAppBar";
import SettingRow from "../../components/common/SettingRow";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const GeneralSettings: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isDark, toggle } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="bg-background text-on-surface min-h-screen pb-24">
      <TopAppBar title="Cài đặt chung" showBack={true} />
      <main className="flex-1 mt-16 px-margin-mobile pt-4 space-y-4 max-w-md mx-auto w-full">
        <SettingRow
          icon={isDark ? "dark_mode" : "light_mode"}
          title={isDark ? "Giao diện tối" : "Giao diện sáng"}
          color="blue"
          type="toggle"
          toggled={isDark}
          onToggle={toggle}
        />
        <SettingRow
          icon="logout"
          title="Đăng xuất"
          color="red"
          type="button"
          buttonLabel="Đăng xuất"
          onAction={handleLogout}
        />
      </main>
    </div>
  );
};

export default GeneralSettings;
