import React, { useState, useEffect } from "react";
import TopAppBar from "../../components/layout/TopAppBar";
import axiosClient from "../../api/axiosClient";
import axios from "axios";
import { useParams } from "react-router-dom";
import QRCode from "../../components/common/QRcode";

interface BankAccount {
  accountNumber: string;
  bankName: string;
  accountName: string;
}

interface PaymentInfo {
  ownerId: string;
  participantId: string;
  bankAccount: BankAccount | null;
  amount: number;
  paymentCode: string | null;
}

interface PaymentStatus {
  isPaid: boolean;
  transaction?: {
    _id: string;
    amount: number;
    date: string;
    status: string;
  } | null;
}

const PaymentPage: React.FC = () => {
  const { participantId: paramParticipantId, id: paramId } = useParams<{
    participantId?: string;
    id?: string;
  }>();
  const participantId = paramParticipantId ?? paramId;

  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<{
    _id: string;
    amount: number;
    date: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    const fetchPayment = async () => {
      if (!participantId) {
        setError("participantId is required");
        setLoading(false);
        return;
      }

      try {
        const resp = await axiosClient.get(`/payment/${participantId}`);
        setPaymentInfo(resp.data as PaymentInfo);
      } catch (err: unknown) {
        let message = "Lỗi khi lấy thông tin thanh toán";
        if (axios.isAxiosError(err)) {
          message = err.response?.data?.message || err.message || message;
        } else if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [participantId]);

  // Sử dụng cơ chế setTimeout đệ quy để tránh các yêu cầu mạng bị chồng chéo (overlapping)
  useEffect(() => {
    if (!participantId || loading || isPaid) return;

    let timerId: ReturnType<typeof setTimeout>;
    let active = true;

    const checkStatus = async () => {
      try {
        setCheckingStatus(true);
        const resp = await axiosClient.get(`/payment/${participantId}/status`);
        const status = resp.data as PaymentStatus;

        if (active) {
          if (status.isPaid) {
            setIsPaid(true);
            setTransactionDetails(status.transaction ?? null);
          } else {
            // Chỉ lên lịch chạy lần tiếp theo nếu chưa thanh toán và component vẫn active
            timerId = setTimeout(checkStatus, 3000);
          }
        }
      } catch {
        console.log("Checking payment status...");
        if (active) {
          timerId = setTimeout(checkStatus, 3000);
        }
      } finally {
        if (active) {
          setCheckingStatus(false);
        }
      }
    };

    checkStatus();

    return () => {
      active = false;
      clearTimeout(timerId);
    };
  }, [participantId, loading, isPaid]);

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-24 font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      <TopAppBar title={"Thanh toán"} />

      <main className="pt-20 px-margin-mobile min-h-screen space-y-6 max-w-md mx-auto">
        {loading && (
          <p className="text-center mt-10 text-on-surface-variant">
            {"Đang tải..."}
          </p>
        )}

        {!loading && error && (
          <div className="p-md rounded-xl bg-surface-container-lowest border border-outline-variant animate-in fade-in slide-in-from-bottom-2">
            <p className="text-center text-error">{error}</p>
          </div>
        )}

        {isPaid && (
          <div className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant card-shadow animate-in fade-in slide-in-from-bottom-4 space-y-6">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-400">
              <svg
                className="w-10 h-10 stroke-current"
                fill="none"
                strokeWidth="3"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              <span className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping"></span>
            </div>
            <div className="text-center space-y-2">
              <h2 className="font-headline-md text-emerald-600 dark:text-emerald-400 font-bold">
                Thanh toán thành công!
              </h2>
              <p className="text-sm text-on-surface-variant">
                Giao dịch của bạn đã được hệ thống ghi nhận.
              </p>
            </div>

            {transactionDetails && (
              <div className="w-full bg-surface-container-low rounded-2xl p-4 space-y-3 text-sm border border-outline-variant/30">
                <h3 className="font-title-small text-on-surface font-semibold border-b border-outline-variant/30 pb-2">
                  Chi tiết biên lai
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-xs">
                    Mã giao dịch
                  </span>
                  <span className="font-mono text-xs text-on-surface font-medium select-all">
                    {transactionDetails._id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-xs">
                    Số tiền đã trả
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {transactionDetails.amount.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-xs">
                    Thời gian
                  </span>
                  <span className="text-on-surface text-xs">
                    {new Date(transactionDetails.date).toLocaleString("vi-VN")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-xs">
                    Trạng thái
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Hoàn tất
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => window.history.back()}
              className="w-full py-3 px-4 bg-primary hover:bg-primary-container text-on-primary rounded-full font-semibold squishy-active transition duration-200"
            >
              Quay lại
            </button>
          </div>
        )}

        {!loading && !error && paymentInfo && !isPaid && (
          <div className="space-y-6">
            {paymentInfo.amount <= 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant card-shadow animate-in fade-in slide-in-from-bottom-4 space-y-4">
                <div className="flex justify-center text-primary">
                  <svg
                    className="w-16 h-16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0114 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                </div>
                <h2 className="font-headline-sm font-semibold">
                  Không có khoản nợ nào
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Bạn đã hoàn thành tất cả các khoản thanh toán cho thành viên
                  này.
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="w-full py-3 px-4 bg-primary text-on-primary rounded-full font-semibold squishy-active"
                >
                  Quay lại
                </button>
              </div>
            ) : paymentInfo.bankAccount ? (
              <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="font-headline-md text-on-surface font-bold">
                  {"Quét QR để thanh toán"}
                </h2>
                <div className="p-4 bg-surface-container-lowest rounded-2xl card-shadow border border-outline-variant/30">
                  <QRCode
                    accountNumber={paymentInfo.bankAccount.accountNumber}
                    bankName={paymentInfo.bankAccount.bankName}
                    accountName={paymentInfo.bankAccount.accountName}
                    amount={paymentInfo.amount}
                    content={paymentInfo.paymentCode ?? ""}
                  />
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl w-full max-w-sm">
                  <svg
                    className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                  <div className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed text-left">
                    <strong>Lưu ý quan trọng:</strong> Vui lòng giữ nguyên nội
                    dung chuyển khoản được điền sẵn để hệ thống tự động ghi nhận
                    thanh toán ngay lập tức.
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container-low py-2 px-4 rounded-full border border-outline-variant/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span>
                    {checkingStatus
                      ? "Đang kiểm tra giao dịch..."
                      : "Đang chờ chuyển khoản..."}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-md rounded-xl bg-surface-container-lowest border border-outline-variant">
                <p className="text-center text-on-surface-variant">
                  Chủ sở hữu chưa liên kết tài khoản ngân hàng.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PaymentPage;
