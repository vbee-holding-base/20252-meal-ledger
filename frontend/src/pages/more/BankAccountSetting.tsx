import React, { useEffect, useState } from "react";
import TopAppBar from "../../components/layout/TopAppBar";
import axiosClient from "../../api/axiosClient";
import BankHubIframe from "../../components/common/BankHubIframe";

interface BankAccountInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

const BankAccountSettings: React.FC = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccountInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    loadBankAccount();
  }, []);

  const loadBankAccount = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/bankhub/bank-account");
      const data = res.data as BankAccountInfo[];
      setBankAccounts(Array.isArray(data) ? data : []);
    } catch {
      setBankAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  if (showIframe) {
    return (
      <div className="bg-background text-on-surface min-h-screen pb-24">
        <header className="fixed top-0 w-full max-w-md z-50 flex items-center justify-between px-margin-mobile h-16 bg-surface">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary-container/10 transition-colors active:scale-95 duration-200"
            onClick={() => setShowIframe(false)}
          >
            <span className="material-symbols-outlined text-primary">
              arrow_back
            </span>
          </button>
          <h1 className="absolute inset-0 flex items-center justify-center font-headline-md text-headline-md pointer-events-none text-primary-container">
            Liên kết tài khoản
          </h1>
          <div className="w-10" />
        </header>
        <main className="mt-16 px-margin-mobile max-w-md mx-auto pt-6 space-y-4">
          <BankHubIframe />
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface min-h-screen pb-24">
      <TopAppBar title="Tài khoản ngân hàng" />

      <main className="mt-16 px-margin-mobile max-w-md mx-auto space-y-6 pt-6">
        <div className="bg-surface-container-lowest rounded-2xl p-md card-shadow space-y-5">
          <div className="flex items-center gap-3 pb-2 border-b border-outline-variant">
            <span className="material-symbols-outlined text-primary text-[24px]">
              account_balance
            </span>
            <h2 className="font-headline-md text-on-surface text-lg">
              Tài khoản đã liên kết
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-6 text-on-surface-variant">
              Đang tải thông tin...
            </div>
          ) : bankAccounts.length > 0 ? (
            <div className="space-y-4">
              {bankAccounts.map((account, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-primary-container/10 border border-primary/20 space-y-3"
                >
                  <div className="flex justify-between">
                    <span className="text-label-md text-on-surface-variant">
                      Ngân hàng
                    </span>
                    <span className="text-body-md font-bold text-on-surface">
                      {account.bankName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-label-md text-on-surface-variant">
                      Số tài khoản
                    </span>
                    <span className="text-body-md font-bold text-on-surface">
                      {account.accountNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-label-md text-on-surface-variant">
                      Chủ tài khoản
                    </span>
                    <span className="text-body-md font-bold text-on-surface">
                      {account.accountName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-on-surface-variant space-y-2">
              <span className="material-symbols-outlined text-outline text-[48px]">
                no_accounts
              </span>
              <p className="text-body-md">
                Chưa liên kết tài khoản ngân hàng nào.
              </p>
              <p className="text-label-sm">
                Hãy liên kết tài khoản qua BankHub để nhận thanh toán tự động.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowIframe(true)}
          className="w-full h-14 rounded-full bg-primary text-on-primary font-bold shadow-md active:scale-95 transition-transform"
        >
          {bankAccounts.length > 0
            ? "Thay đổi liên kết tài khoản"
            : "Liên kết tài khoản ngân hàng"}
        </button>
      </main>
    </div>
  );
};

export default BankAccountSettings;
