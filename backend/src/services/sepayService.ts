import { redisClient } from "../config/redis";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
  NotFoundError,
  UnauthorisedError,
  ValidationError,
  ExternalError,
} from "../config/errors";

interface LinkTokenPayload {
  company_xid: string;
  purpose: string;
  completion_redirect_uri?: string;
}
interface SePayTokenResponse {
  access_token: string;
  expires_in?: number;
  token_type?: string;
}

const TOKEN_KEY: string = "sepay_system_token";
const TOKEN_TTL: number = 59900;

export const getSystemToken = async (): Promise<string> => {
  try {
    let cachedToken: string | null = null;

    try {
      if (redisClient.isOpen) {
        cachedToken = await redisClient.get(TOKEN_KEY);
      }
    } catch (redisError) {
      console.warn(
        "[SePay Service] Lỗi đọc token từ Redis, sẽ gọi API trực tiếp:",
        redisError,
      );
    }

    if (cachedToken) {
      return cachedToken;
    }

    const auth = Buffer.from(
      `${process.env.SEPAY_CLIENT_ID}:${process.env.SEPAY_CLIENT_SECRET}`,
    ).toString("base64");

    const response: AxiosResponse<SePayTokenResponse> = await axios.post(
      `${process.env.SEPAY_URL_SANDBOX}/v1/token`,
      {},
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
    );

    const newToken: string = response.data.access_token;

    try {
      if (redisClient.isOpen) {
        await redisClient.set(TOKEN_KEY, newToken, {
          EX: TOKEN_TTL,
        });
      }
    } catch (redisError) {
      console.warn("[SePay Service] Lỗi ghi token vào Redis:", redisError);
    }

    return newToken;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error(
      "[SePay Service] Lỗi cấp System Token:",
      axiosError.response?.data || axiosError.message,
    );
    throw new Error("Không thể xác thực với hệ thống SePay");
  }
};

export const createBankHubLink = async (
  companyXid: string,
  purpose: string = "LINK_BANK_ACCOUNT",
  redirectUri: string | null = null,
): Promise<any> => {
  const systemToken = await getSystemToken();

  const payload: LinkTokenPayload = {
    company_xid: companyXid,
    purpose: purpose,
  };

  if (redirectUri) {
    payload.completion_redirect_uri = redirectUri;
  }

  try {
    const response = await axios.post(
      `${process.env.SEPAY_URL_SANDBOX}/v1/link-token/create`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${systemToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 200 || response.status === 201) {
      return response.data;
    }

    throw new ExternalError(
      `Failed to create link token with status: ${response.status}`,
    );
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      const status = axiosError.response.status;
      if (status === 400) {
        throw new ValidationError("Validation Error");
      }
      if (status === 401) {
        throw new UnauthorisedError("Unauthorized");
      }
      if (status === 404) {
        throw new NotFoundError("Not found (Công ty không tồn tại)");
      }
    }
    throw new ExternalError(`Lỗi kết nối tới SePay: ${axiosError.message}`);
  }
};
