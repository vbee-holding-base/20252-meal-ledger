import React from "react";
import TopAppBar from "../../components/layout/TopAppBar";
import MoreCard from "../../components/common/MoreCard";

const More: React.FC = () => (
  <div className="bg-background text-on-surface min-h-screen pb-24">
    <TopAppBar title="Khác" showBack={false} />
    <main className="flex-1 mt-16 px-margin-mobile pt-4 space-y-4 max-w-md mx-auto w-full">
      <MoreCard
        item={{
          path: "/more/bank-account",
          icon: "account_balance",
          title: "Tài khoản ngân hàng",
          subtitle: "Quản lý thông tin tài khoản ngân hàng",
        }}
        color="blue"
      />
      <MoreCard
        item={{
          path: "/more/general-settings",
          icon: "settings",
          title: "Cài đặt chung",
          subtitle: "Đơn vị tiền tệ, ngôn ngữ, thông báo",
        }}
        color="orange"
      />
      <MoreCard
        item={{
          path: "/more/help",
          icon: "help",
          title: "Trợ giúp",
          subtitle: "Hướng dẫn sử dụng và liên hệ",
        }}
        color="yellow"
      />
    </main>
  </div>
);

export default More;
