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
  bank_account_xid?: string;
}
interface SePayTokenResponse {
  access_token: string;
  expires_in?: number;
  token_type?: string;
}

const TOKEN_KEY: string = "sepay_system_token";
const TOKEN_TTL: number = 59900;

export const getSepayBaseUrl = (): string => {
  const clientID = process.env.SEPAY_CLIENT_ID || "";
  if (clientID.startsWith("BH-SB-") || process.env.NODE_ENV !== "production") {
    return (
      process.env.SEPAY_URL_SANDBOX || "https://bankhub-api-sandbox.sepay.vn"
    );
  }
  return process.env.SEPAY_URL_PRODUCTION || "https://bankhub-api.sepay.vn";
};

export const getSystemToken = async (): Promise<string> => {
  try {
    let cachedToken: string | null = null;

    try {
      if (redisClient.isOpen) {
        cachedToken = await redisClient.get(TOKEN_KEY);
      }
    } catch (redisError) {
      console.warn(
        "[SePay Service] Error reading token from Redis, will call the API directly:",
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
      `${getSepayBaseUrl()}/v1/token`,
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
      console.warn("[SePay Service] Error writing token to Redis:", redisError);
    }

    return newToken;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error(
      "[SePay Service] System Token error:",
      axiosError.response?.data || axiosError.message,
    );
    throw new Error("Can't authenticate with the SePay system");
  }
};

export const createBankHubLink = async (
  companyXid: string,
  purpose: string = "LINK_BANK_ACCOUNT",
  redirectUri: string | null = null,
  bankAccountXid: string | null = null,
): Promise<any> => {
  const systemToken = await getSystemToken();

  const payload: LinkTokenPayload = {
    company_xid: companyXid,
    purpose: purpose,
  };

  if (redirectUri) {
    payload.completion_redirect_uri = redirectUri;
  }

  if (bankAccountXid) {
    payload.bank_account_xid = bankAccountXid;
  }

  try {
    const response = await axios.post(
      `${getSepayBaseUrl()}/v1/link-token/create`,
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
        const errorData = JSON.stringify(axiosError.response?.data);
        console.error("SePay 400 Error Data:", errorData);
        throw new ValidationError(`Validation Error: ${errorData}`);
      }
      if (status === 401) {
        throw new UnauthorisedError("Unauthorized");
      }
      if (status === 404) {
        throw new NotFoundError("Not found company");
      }
    }
    throw new ExternalError(`Connection error to SePay: ${axiosError.message}`);
  }
};
