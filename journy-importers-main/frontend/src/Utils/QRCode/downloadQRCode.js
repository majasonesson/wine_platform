import { getQRCodeURL } from "../../Services/getQRCodeURL";
import { generateQRCode } from "../QRCode/generateQRCode";

export const downloadQRCode = async (wineId) => {

  try {
    const response = await getQRCodeURL(wineId);
    const qrCode = await generateQRCode(response.data.qrCode);
    
    // Create a temporary link element
    const link = document.createElement("a");

    // Set href to the QR data or URL
    link.href = qrCode;
    // Set the download filename
    link.download = `QR-${response.data.qrCode}.png`;
    // Append to the body temporarily
    document.body.appendChild(link);

    link.click(); // Trigger the download

    document.body.removeChild(link); // Clean up
  } catch (error) {
    console.error("Error generating QR code:", error);
  }
}
