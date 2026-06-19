const { createClient } = require("redis");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");
const readline = require("readline");

require("ts-node").register();
const { generatePaymentCode } = require("../src/utils/paymentCode");

dotenv.config({ path: path.join(__dirname, "../.env") });

const TRANSACTION_CONFIG = {
  bank_account_xid: "ba17e0cb-6b04-11f1-b21a-a6006ab65aca",

  transfer_type: "credit",

  amount: 40000,

  transaction_content: "ML36kb1iye7208lwrhup236nf0qebkjllgip8cre",
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

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
    console.log("\n=== GIẢ LẬP GIAO DỊCH SEPAY ===");
    const ownerId = await askQuestion(
      "Nhập ownerId (bỏ qua để dùng mặc định): ",
    );
    const participantId = await askQuestion(
      "Nhập participantId (bỏ qua để dùng mặc định): ",
    );

    let transactionContent = TRANSACTION_CONFIG.transaction_content;
    if (ownerId.trim() && participantId.trim()) {
      try {
        transactionContent = generatePaymentCode(
          ownerId.trim(),
          participantId.trim(),
        );
        console.log(`-> Đã tạo transaction_content: ${transactionContent}`);
      } catch (err) {
        console.error(`-> Lỗi khi tạo mã giao dịch: ${err.message}`);
        console.log(
          `-> Sử dụng transaction_content mặc định: ${transactionContent}`,
        );
      }
    } else {
      console.log(
        `-> Sử dụng transaction_content mặc định: ${transactionContent}`,
      );
    }

    const token = await getAccessToken();
    console.log("\nĐang gửi yêu cầu giả lập giao dịch tới SePay Sandbox...");

    const response = await axios.post(
      `${sandboxUrl}/v1/transaction/create`,
      {
        bank_account_xid: TRANSACTION_CONFIG.bank_account_xid,
        transfer_type: TRANSACTION_CONFIG.transfer_type,
        amount: TRANSACTION_CONFIG.amount,
        transaction_content: transactionContent,
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
  } finally {
    rl.close();
  }
}

simulateTransaction();
