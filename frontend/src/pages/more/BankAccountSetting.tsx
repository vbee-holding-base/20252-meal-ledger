import React, { useEffect, useState } from "react";
import TopAppBar from "../../components/layout/TopAppBar";
import { BANKS, getBankByCode, getBankByName } from "../../constants/banks";
import axiosClient from "../../api/axiosClient";

const BankAccountSettings: React.FC = () => {
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadBankAccount();
  }, []);

  const loadBankAccount = async () => {
    try {
      const res = await axiosClient.get("/bank-account");
      const data = res.data as {
        bankName: string;
        accountNumber: string;
        accountName: string;
      };
      if (data.bankName && data.accountNumber && data.accountName) {
        const bank = getBankByName(data.bankName);
        if (bank) setBankCode(bank.code);
        setAccountNumber(data.accountNumber);
        setAccountName(data.accountName);
      }
    } catch {
      //
    }
  };

  const handleVerify = async () => {
    if (!bankCode || !accountNumber) {
      setMessage({
        type: "error",
        text: "Please select a bank and enter an account number",
      });
      return;
    }
    setMessage(null);
    try {
      const res = await axiosClient.post("/bank-account/verify", {
        bankCode,
        accountNumber,
      });
      const { is_valid, account_name } = res.data as {
        is_valid: boolean;
        account_name: string | null;
      };
      if (is_valid && account_name) {
        setAccountName(account_name);
        setMessage(null);
      } else {
        setMessage({
          type: "error",
          text: "Account name not found, please check your information",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Unable to verify account, please try again",
      });
    }
  };

  const handleSave = async () => {
    if (!accountName) return;
    const bank = getBankByCode(bankCode);
    if (!bank) return;

    setMessage(null);
    try {
      await axiosClient.put("/bank-account", {
        bankName: bank.shortName,
        accountNumber,
        accountName,
      });
      setMessage({ type: "success", text: "Bank account saved" });
    } catch {
      setMessage({ type: "error", text: "Failed to save bank account" });
    }
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBankCode(e.target.value);
    setAccountName("");
  };

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAccountNumber(e.target.value.replace(/\D/g, ""));
    setAccountName("");
  };

  return (
    <div className="bg-background text-on-surface min-h-screen pb-24">
      <TopAppBar title="Tài khoản ngân hàng" />

      <main className="mt-16 px-margin-mobile max-w-md mx-auto space-y-6 pt-6">
        <div className="bg-surface-container-lowest rounded-2xl p-md shadow-[0_4px_20px_rgba(153,71,0,0.08)] space-y-5">
          <div className="flex items-center gap-3 pb-2 border-b border-surface-container-high">
            <span className="material-symbols-outlined text-primary text-[24px]">
              account_balance
            </span>
            <h2 className="font-headline-md text-on-surface text-lg">
              Thông tin tài khoản
            </h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-label-md font-label-md text-on-surface-variant">
              Tên ngân hàng
            </label>
            <div className="relative">
              <select
                value={bankCode}
                onChange={handleBankChange}
                className="w-full h-14 px-4 rounded-2xl border-2 border-surface-container-high focus:border-primary focus:ring-0 text-body-md transition-all bg-transparent cursor-pointer"
              >
                <option value="">Chọn ngân hàng</option>
                {BANKS.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.shortName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-label-md font-label-md text-on-surface-variant">
              Số tài khoản
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={accountNumber}
              onChange={handleAccountNumberChange}
              placeholder=""
              className="w-full h-14 px-4 rounded-2xl border-2 border-surface-container-high focus:border-primary focus:ring-0 text-body-md transition-all bg-transparent"
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={!bankCode || !accountNumber}
            className="w-full h-14 rounded-full bg-primary-container text-on-primary font-bold shadow-md active:scale-95 transition-transform disabled:opacity-50"
          >
            Xác thực tài khoản
          </button>

          {accountName && (
            <div className="space-y-1.5">
              <label className="text-label-md font-label-md text-on-surface-variant">
                Chủ tài khoản
              </label>
              <div className="w-full h-14 px-4 rounded-2xl border-2 border-primary bg-primary-container/10 flex items-center">
                <span className="text-body-md font-medium text-on-surface">
                  {accountName}
                </span>
              </div>
            </div>
          )}
        </div>

        {message && (
          <p
            className={
              message.type === "error"
                ? "text-error font-body-sm"
                : "text-primary font-body-sm"
            }
          >
            {message.text}
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={!accountName}
          className="w-full h-14 rounded-full bg-primary-container text-on-primary font-bold shadow-md active:scale-95 transition-transform disabled:opacity-50"
        >
          Lưu thông tin
        </button>
      </main>
    </div>
  );
};

export default BankAccountSettings;
