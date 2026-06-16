import React, { useEffect, useRef, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { AxiosError } from "axios";

function BankHubIframe() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hostedLinkUrl, setHostedLinkUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLinkUrl() {
      try {
        const response = await axiosClient.post("/bankhub/generate-link");
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
      if (event.origin !== "https://bankhub.sepay.vn") return;

      const { event: eventType, metadata } = event.data;

      switch (eventType) {
        case "FINISHED_BANK_ACCOUNT_LINK":
          console.log("Tài khoản đã được liên kết:", metadata);
          window.location.href = "/more/bank-account";
          break;

        case "FINISHED_BANK_ACCOUNT_UNLINK":
          console.log("Tài khoản đã được hủy liên kết");
          window.location.href = "/more/bank-account";
          break;

        case "BANKHUB_CLOSE_LINK":
          console.log("Người dùng đóng flow liên kết");
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
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <iframe
      ref={iframeRef}
      src={hostedLinkUrl}
      style={{
        width: "100%",
        height: "600px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
      frameBorder="0"
      allow="clipboard-write"
    />
  );
}

export default BankHubIframe;
