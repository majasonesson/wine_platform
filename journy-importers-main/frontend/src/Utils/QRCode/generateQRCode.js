import QRCode from "qrcode";

export const generateQRCode = async (QRCodeURL) => {
  try {
    // Generate QR code as base64 string
    const qrCode = await QRCode.toDataURL(QRCodeURL);
    
    return qrCode;
  } catch(error) {
    throw new Error("QR Code generation failed", error);
  }
}