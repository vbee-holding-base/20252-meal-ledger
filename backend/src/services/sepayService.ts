export interface SePayLookupResult {
  is_valid: boolean;
  account_name: string | null;
}

export const lookupBankAccount = async (
  bankCode: string,
  accountNumber: string,
): Promise<SePayLookupResult> => {
  if (!bankCode || !accountNumber || accountNumber.length < 8) {
    return { is_valid: false, account_name: null };
  }

  return {
    is_valid: true,
    account_name: "NGUYEN KIM HUY",
  };
};
