export interface Bank {
  code: string;
  shortName: string;
  fullName: string;
}

export const BANKS: Bank[] = [
  {
    code: "VCB",
    shortName: "Vietcombank",
    fullName: "Ngân hàng TMCP Ngoại Thương Việt Nam",
  },
  {
    code: "BIDV",
    shortName: "BIDV",
    fullName: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
  },
  {
    code: "ICB",
    shortName: "VietinBank",
    fullName: "Ngân hàng TMCP Công Thương Việt Nam",
  },
  { code: "MB", shortName: "MB Bank", fullName: "Ngân hàng TMCP Quân Đội" },
  { code: "ACB", shortName: "ACB", fullName: "Ngân hàng TMCP Á Châu" },
  {
    code: "TCB",
    shortName: "Techcombank",
    fullName: "Ngân hàng TMCP Kỹ Thương",
  },
  {
    code: "VPB",
    shortName: "VPBank",
    fullName: "Ngân hàng TMCP Việt Nam Thịnh Vượng",
  },
  { code: "TPB", shortName: "TPBank", fullName: "Ngân hàng TMCP Tiên Phong" },
  {
    code: "STB",
    shortName: "Sacombank",
    fullName: "Ngân hàng TMCP Sài Gòn Thương Tín",
  },
  {
    code: "HDB",
    shortName: "HDBank",
    fullName: "Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh",
  },
  { code: "MSB", shortName: "MSB", fullName: "Ngân hàng TMCP Hàng Hải" },
  { code: "VIB", shortName: "VIB", fullName: "Ngân hàng TMCP Quốc tế" },
  { code: "OCB", shortName: "OCB", fullName: "Ngân hàng TMCP Phương Đông" },
  {
    code: "SHB",
    shortName: "SHB",
    fullName: "Ngân hàng TMCP Sài Gòn - Hà Nội",
  },
  { code: "NAB", shortName: "NamABank", fullName: "Ngân hàng TMCP Nam Á" },
  { code: "ABB", shortName: "ABBank", fullName: "Ngân hàng TMCP An Bình" },
  { code: "SSB", shortName: "SeABank", fullName: "Ngân hàng TMCP Đông Nam Á" },
];

export const getBankByCode = (code: string): Bank | undefined =>
  BANKS.find((b) => b.code === code);

export const getBankByName = (name: string): Bank | undefined =>
  BANKS.find((b) => b.shortName === name || b.fullName === name);
