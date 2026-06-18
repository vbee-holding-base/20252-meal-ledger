const { createClient } = require("redis");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");

// Tải cấu hình môi trường từ file .env của backend
dotenv.config({ path: path.join(__dirname, "../.env") });

// =====================================================================
// CẤU HÌNH THÔNG TIN GIAO DỊCH GIẢ LẬP BẰNG TAY (BẠN TỰ NHẬP Ở ĐÂY)
// =====================================================================
const TRANSACTION_CONFIG = {
  // Thay thế bằng ID tài khoản ngân hàng liên kết trong Sandbox SePay của bạn (UUID)
  bank_account_xid: "ba17e0cb-6b04-11f1-b21a-a6006ab65aca",

  // Loại giao dịch: "credit" (tiền vào) hoặc "debit" (tiền ra)
  transfer_type: "credit",

  // Số tiền giao dịch (VND)
  amount: 35000,

  // Nội dung chuyển khoản (chứa mã thanh toán ML...)
  transaction_content: "ML36kb1iye7208lwrhup236nf0qebkjllgip8cre",
};
// =====================================================================

const REDIS_KEY = "sepay_system_token";

async function getAccessToken() {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  const clientId = process.env.SEPAY_CLIENT_ID;
  const clientSecret = process.env.SEPAY_CLIENT_SECRET;
  const sandboxUrl =
    process.env.SEPAY_URL_SANDBOX || "https://bankhub-api-sandbox.sepay.vn";

  console.log(`Đang kết nối tới Redis tại: ${redisUrl}...`);
  const redisClient = createClient({ url: redisUrl });

  let accessToken = null;

  try {
    await redisClient.connect();
    console.log("Đã kết nối Redis thành công.");
    accessToken = await redisClient.get(REDIS_KEY);
  } catch (err) {
    console.warn("Không thể kết nối hoặc đọc token từ Redis:", err.message);
  } finally {
    if (redisClient.isOpen) {
      await redisClient.quit();
      console.log("Đã đóng kết nối Redis.");
    }
  }

  if (accessToken) {
    console.log("Đã lấy được Access Token từ bộ nhớ đệm Redis.");
    return accessToken;
  }

  // Dự phòng: Nếu chưa có trong Redis, tự động gọi API cấp mới từ SePay bằng ID/Secret
  console.log(
    "Không tìm thấy token trong Redis. Đang gọi API SePay cấp mới...",
  );
  if (!clientId || !clientSecret) {
    throw new Error(
      "SEPAY_CLIENT_ID hoặc SEPAY_CLIENT_SECRET chưa được cấu hình trong file .env để cấp mới token.",
    );
  }

  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );
  const tokenResponse = await axios.post(
    `${sandboxUrl}/v1/token`,
    {},
    {
      headers: {
        Authorization: `Basic ${authHeader}`,
      },
    },
  );
  return tokenResponse.data.access_token;
}

async function simulateTransaction() {
  const sandboxUrl =
    process.env.SEPAY_URL_SANDBOX || "https://bankhub-api-sandbox.sepay.vn";

  try {
    const token = await getAccessToken();
    console.log("\nĐang gửi yêu cầu giả lập giao dịch tới SePay Sandbox...");

    const response = await axios.post(
      `${sandboxUrl}/v1/transaction/create`,
      {
        bank_account_xid: TRANSACTION_CONFIG.bank_account_xid,
        transfer_type: TRANSACTION_CONFIG.transfer_type,
        amount: TRANSACTION_CONFIG.amount,
        transaction_content: TRANSACTION_CONFIG.transaction_content,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("\nChúc mừng! Đã tạo giao dịch giả lập thành công:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(
      "\nLỗi khi giả lập giao dịch:",
      error.response?.data || error.message,
    );
  }
}

simulateTransaction();
