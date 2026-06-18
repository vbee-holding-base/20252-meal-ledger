import React from "react";

interface QRCodeProps {
  accountNumber: string;
  bankName: string;
  accountName: string;
  amount: number;
  content: string;
}

const QRCode: React.FC<QRCodeProps> = ({
  accountNumber,
  bankName,
  accountName,
  amount,
  content,
}) => {
  const linkQRCode: string = `https://qr.sepay.vn/img?acc=${accountNumber}&bank=${bankName}&amount=${amount}&des=${content}&showinfo=true&download=false&fullacc=true&holder=${accountName}`;
  return (
    <div className="realative">
      <img src={linkQRCode} alt="QR thanh toán VietQR" />
    </div>
  );
};

export default QRCode;
