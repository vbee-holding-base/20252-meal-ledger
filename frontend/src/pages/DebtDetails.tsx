import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const DebtDetails: React.FC = () => {
  const navigate = useNavigate();
  // Using a param like /debts/:name, defaulting to a mock name for now
  const { name = "Đình Vĩnh" } = useParams();

  const transactions = [
    {
      id: "1",
      store: "Bún Chả Sinh Từ",
      date: "12/10/2023",
      amount: 40000,
      icon: "restaurant",
    },
    {
      id: "2",
      store: "Mì Vằn Thắn",
      date: "10/10/2023",
      amount: 45000,
      icon: "ramen_dining",
    },
    {
      id: "3",
      store: "Highlands Coffee",
      date: "08/10/2023",
      amount: 35000,
      icon: "coffee",
    },
  ];

  const totalAmount = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pb-20">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full max-w-md z-50 flex items-center justify-between px-margin-mobile h-16 bg-surface">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary-container/10 transition-colors active:scale-95 duration-200"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined text-primary">
            arrow_back
          </span>
        </button>
        <h1 className="text-headline-md font-bold tracking-tight text-center text-primary whitespace-nowrap">
          Chi tiết công nợ
        </h1>
        <div className="w-10"></div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mt-16 mb-6 px-margin-mobile max-w-md mx-auto w-full">
        {/* Participant Summary Hero */}
        <section className="py-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-surface-container-lowest p-md rounded-[24px] shadow-[0_4px_20px_rgba(153,71,0,0.1)] flex flex-col items-center relative overflow-hidden pt-lg">
            {/* Background Accent Pattern */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-container/10 rounded-full blur-3xl"></div>

            <h2 className="font-headline-md text-headline-md text-on-background mb-1">
              {name}
            </h2>
            <div className="flex items-center gap-2 mb-md">
              <span className="material-symbols-outlined text-secondary text-base">
                account_balance_wallet
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Tổng nợ chưa thanh toán
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[48px] font-extrabold text-primary leading-none tracking-tight">
                {totalAmount.toLocaleString("vi-VN")}đ
              </span>
              <button className="mt-md bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-bold py-3 px-8 rounded-full transition-all duration-200 active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/20">
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  payments
                </span>
                Tất toán ngay
              </button>
            </div>
          </div>
        </section>

        {/* Transactions Header */}
        <div className="flex justify-between items-center mb-sm">
          <h3 className="font-headline-md text-headline-md text-on-background">
            Lịch sử ăn uống
          </h3>
          <span className="font-label-md text-label-md text-primary bg-primary-fixed px-3 py-1 rounded-full">
            {transactions.length} bữa ăn
          </span>
        </div>

        {/* Transaction List */}
        <div className="space-y-4 mb-xl">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-surface-container-lowest p-md rounded-xl shadow-[0_4px_20px_rgba(153,71,0,0.1)] flex items-center gap-4 group transition-all hover:translate-x-1"
            >
              <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined">{tx.icon}</span>
              </div>
              <div className="flex-1 flex justify-between items-center gap-2">
                <div className="flex flex-col">
                  <h4 className="font-label-md text-label-md text-on-background">
                    {tx.store}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
                      calendar_today
                    </span>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      {tx.date}
                    </p>
                  </div>
                </div>
                <span className="font-label-md text-label-md text-primary text-right whitespace-nowrap">
                  {tx.amount.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DebtDetails;
