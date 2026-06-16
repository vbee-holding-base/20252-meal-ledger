import { useEffect, useRef, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { AxiosError } from "axios";

interface BankHubIframeProps {
  purpose?: "LINK_BANK_ACCOUNT" | "UNLINK_BANK_ACCOUNT";
  bankAccountXid?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

function BankHubIframe({
  purpose = "LINK_BANK_ACCOUNT",
  bankAccountXid,
  onSuccess,
  onClose,
}: BankHubIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hostedLinkUrl, setHostedLinkUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLinkUrl() {
      try {
        const response = await axiosClient.post("/bankhub/generate-link", {
          purpose,
          bankAccountXid,
        });
        const data = response.data;
        setHostedLinkUrl(data.hosted_link_url);
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "Failed to get link URL",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchLinkUrl();

    const handleMessage = (event: MessageEvent) => {
      const isSepayOrigin =
        event.origin === "https://bankhub.sepay.vn" ||
        event.origin === "https://bankhub-sandbox.sepay.vn";
      if (!isSepayOrigin) return;

      const { event: eventType, metadata } = event.data;

      switch (eventType) {
        case "FINISHED_BANK_ACCOUNT_LINK":
          console.log("Tài khoản đã được liên kết:", metadata);
          if (onSuccess) onSuccess();
          else window.location.href = "/more/bank-account";
          break;

        case "FINISHED_BANK_ACCOUNT_UNLINK":
          console.log("Tài khoản đã được hủy liên kết");
          if (onSuccess) onSuccess();
          else window.location.href = "/more/bank-account";
          break;

        case "BANKHUB_CLOSE_LINK":
          console.log("Người dùng đóng flow liên kết");
          if (onClose) onClose();
          break;

        case "BANKHUB_TOKEN_EXPIRED":
        case "BANKHUB_SESSION_EXPIRED":
          console.warn("Phiên làm việc hết hạn");
          setError("Phiên làm việc đã hết hạn. Vui lòng tải lại trang.");
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [purpose, bankAccountXid, onSuccess, onClose]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <iframe
      ref={iframeRef}
      src={hostedLinkUrl}
      className="w-full border border-outline-variant rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.1)]"
      style={{ height: "600px" }}
      frameBorder="0"
      allow="clipboard-write"
    />
  );
}

export default BankHubIframe;
