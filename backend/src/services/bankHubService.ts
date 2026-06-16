import {
  createBankHubLink,
  getSystemToken,
  getSepayBaseUrl,
} from "../services/sepayService";
import { findOwnerById, getOwnerNameById } from "../repo/authRepo";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
  NotFoundError,
  UnauthorisedError,
  ValidationError,
  ExternalError,
} from "../config/errors";
import { getOwnerXid, setAllOwnerBankAccount } from "../repo/bankHubRepo";

interface ICreateCompanyBodyRequest {
  full_name: string;
  status: string;
}

interface ICreateCompanyResponse {
  code: number;
  message: string;
  data: {
    xid: string;
    full_name: string;
  };
}

export const generateBankConnectLink = async (
  ownerId: string,
  purpose: string,
  redirectUri: string | null,
): Promise<any> => {
  const owner = await findOwnerById(ownerId);
  return createBankHubLink(owner.xid, purpose, redirectUri);
};

export const generateBankUnconnectLink = async (
  ownerId: string,
  purpose: string,
  redirectUri: string | null,
  bankAccountXid: string,
): Promise<any> => {
  const owner = await findOwnerById(ownerId);
  return createBankHubLink(owner.xid, purpose, redirectUri, bankAccountXid);
};

export const getBankAccountList = async (ownerId: string) => {
  const systemToken = await getSystemToken();
  const ownerXid = await getOwnerXid(ownerId);
  try {
    const response = await axios.get(
      `${getSepayBaseUrl()}/v1/bank-account?limit=10&page=1&company_xid=${ownerXid}`,
      {
        headers: {
          Authorization: `Bearer ${systemToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (response.status === 200) {
      const accounts = response.data?.data;
      if (!Array.isArray(accounts)) {
        throw new ExternalError("Invalid response format from SePay");
      }

      if (accounts.length === 0) {
        return [];
      }

      const bankAccounts = accounts.map((account: any) => ({
        xid: account.xid ?? "",
        bankName: account.brand_name ?? "",
        accountNumber: account.account_number ?? "",
        accountName: account.account_holder_name ?? "",
      }));

      return bankAccounts;
    }

    throw new ExternalError(
      `Failed to get bank account list with status: ${response.status}`,
    );
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      const status = axiosError.response.status;
      if (status === 401) {
        throw new UnauthorisedError("Unauthorized");
      }
    }
    throw new ExternalError(`Lỗi kết nối tới SePay: ${axiosError.message}`);
  }
};

export const updateBankAccount = async (ownerId: string) => {
  const bankAccounts = await getBankAccountList(ownerId);
  await setAllOwnerBankAccount(ownerId, bankAccounts);
  return bankAccounts;
};

export const createCompanyOwner = async (
  ownerId: string,
  status: string = "Active",
): Promise<ICreateCompanyResponse> => {
  const systemToken = await getSystemToken();
  const payload: ICreateCompanyBodyRequest = {
    full_name: await getOwnerNameById(ownerId),
    status: status,
  };
  try {
    const response = await axios.post(
      `${getSepayBaseUrl()}/v1/company/create`,
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
      `Failed to create company with status: ${response.status}`,
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
      if (status === 503) {
        throw new NotFoundError("Service Unavailable (Sepay Database)");
      }
    }
    throw new ExternalError(`Lỗi kết nối tới SePay: ${axiosError.message}`);
  }
};
