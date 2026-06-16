import React, { useState, useEffect } from "react";
import TopAppBar from "../../components/layout/TopAppBar";
import axiosClient, { axiosPublic } from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import type { DebtDetails } from "../../types";

type DebtDetailApiResponse = {
  participant: {
    ownerId: string;
    name: string;
    totalDebt: number;
    status: string;
  };
  history: {
    restaurantName: string;
    date: string;
    amount: number;
  }[];
};

const DebtDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [debtDetails, setDebtDetails] = useState<DebtDetails | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated } = useAuth();

  const fetchDebtDetails = async () => {
    if (!id) {
      setError("ID không hợp lệ.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = isAuthenticated
        ? await axiosClient.get<DebtDetailApiResponse>(`/debts/${id}`)
        : await axiosPublic.get<DebtDetailApiResponse>(`/debts/public/${id}`);
      const data = response.data;
      setDebtDetails({ participant: data.participant, history: data.history });
    } catch (err) {
      console.error(err);
      setDebtDetails(null);
      setError("Không tải được thông tin nợ. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchDebtDetails();
  }, [id]);

  const participant = debtDetails?.participant;
  const history = debtDetails?.history ?? [];
  const totalAmount = participant?.totalDebt ?? 0;

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <TopAppBar title="Chi tiết nợ" />
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-margin-mobile">
          <p className="text-on-surface-variant font-body-md">Đang tải...</p>
        </main>
      </div>
    );
  }

  if (error || !participant) {
    return (
      <div className="bg-background min-h-screen">
        <TopAppBar title="Chi tiết nợ" />
        <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-margin-mobile text-center gap-4">
          <p className="text-on-surface-variant font-body-md">
            {error || "Không tìm thấy thông tin nợ."}
          </p>
          <button
            className="h-12 px-6 rounded-full bg-primary-container text-on-primary font-bold hover:bg-primary transition-colors"
            onClick={() => navigate("/debts")}
          >
            Quay lại
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pb-20">
      <TopAppBar title="Chi tiết nợ" />

      <main className="flex-1 pt-16 mb-6 px-margin-mobile max-w-md mx-auto w-full">
        <section className="py-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-surface-container-lowest p-md rounded-[24px] login-card-shadow flex flex-col items-center relative overflow-hidden pt-lg">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-container/10 rounded-full blur-3xl"></div>

            <h2 className="font-headline-md text-headline-md text-on-background mb-1">
              {participant.name}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-md">
              <span className="inline-flex items-center gap-2 rounded-full bg-surface-container px-3 py-1 text-label-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-base">
                  account_balance_wallet
                </span>
                {participant.status || "Trạng thái không xác định"}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[48px] font-extrabold text-primary leading-none tracking-tight">
                {totalAmount.toLocaleString("vi-VN")}đ
              </span>
              <button
                className={`mt-md rounded-full py-3 px-8 font-bold transition-all duration-200 active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/20 ${
                  totalAmount > 0
                    ? "bg-primary text-on-primary hover:bg-primary-fixed-dim"
                    : "bg-surface-container text-tertiary cursor-not-allowed"
                }`}
                disabled={totalAmount <= 0}
              >
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  payments
                </span>
                {totalAmount > 0 ? "Tất toán ngay" : "Không có nợ"}
              </button>
            </div>
          </div>
        </section>

        <div className="flex justify-between items-center mb-sm">
          <h3 className="font-headline-md text-headline-md text-on-background">
            Lịch sử ăn uống
          </h3>
          <span className="font-label-md text-label-md text-primary bg-primary-fixed px-3 py-1 rounded-full">
            {history.length} bữa ăn
          </span>
        </div>

        <div className="space-y-4 mb-xl">
          {history.length === 0 ? (
            <div className="rounded-3xl border border-outline-variant p-6 text-center text-on-surface-variant">
              Chưa có lịch sử bữa ăn cho người tham gia này.
            </div>
          ) : (
            history.map((tx) => (
              <div
                key={`${tx.restaurantName}-${tx.date}-${tx.amount}`}
                className="bg-surface-container-lowest p-md rounded-xl login-card-shadow flex items-center gap-4 group transition-all hover:translate-x-1"
              >
                <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined">restaurant</span>
                </div>
                <div className="flex-1 flex justify-between items-center gap-2">
                  <div className="flex flex-col">
                    <h4 className="font-label-md text-label-md text-on-background">
                      {tx.restaurantName}
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
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default DebtDetailsPage;
