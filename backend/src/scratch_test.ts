import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { getSystemToken } from "./services/sepayService";

async function test() {
  const token = await getSystemToken();
  try {
    console.log("Testing with local IP...");
    await axios.post(
      `${process.env.SEPAY_URL_SANDBOX}/v1/link-token/create`,
      {
        company_xid: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        purpose: "LINK_BANK_ACCOUNT",
        completion_redirect_uri: "http://192.168.1.5:5173/more/bank-account",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  } catch (e: any) {
    console.log(
      "Local IP:",
      e.response?.status,
      e.response?.data ? e.response?.data : e.message,
    );
  }
}

test();
