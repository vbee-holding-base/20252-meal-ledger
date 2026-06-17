import React from "react";
import { useTranslation } from "react-i18next";
import TopAppBar from "../../components/layout/TopAppBar";
import MoreCard from "../../components/common/MoreCard";

const More: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-background text-on-surface min-h-screen pb-24">
      <TopAppBar title={t("more.title")} showBack={true} />
      <main className="flex-1 mt-16 px-margin-mobile pt-4 space-y-4 max-w-md mx-auto w-full">
        <MoreCard
          item={{
            path: "/more/bank-account",
            icon: "account_balance",
            title: t("more.bankAccount"),
            subtitle: t("more.bankAccountDesc"),
          }}
          color="blue"
        />
        <MoreCard
          item={{
            path: "/more/general-settings",
            icon: "settings",
            title: t("more.generalSettings"),
            subtitle: t("more.generalSettingsDesc"),
          }}
          color="orange"
        />
        <MoreCard
          item={{
            path: "/more/help",
            icon: "help",
            title: t("more.help"),
            subtitle: t("more.helpDesc"),
          }}
          color="yellow"
        />
      </main>
    </div>
  );
};

export default More;
