import QRCode from 'qrcode';

// Get QR code URL from wine ID
export const getQRCodeURL = async (wineId: number): Promise<string> => {
  const url = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/product/${wineId}`;
  return url;
};

// Generate QR code data URL
export const generateQRCode = async (wineId: number): Promise<string> => {
  const url = await getQRCodeURL(wineId);
  
  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

// Download QR code as image
export const downloadQRCode = async (wineId: number, wineName: string) => {
  const dataUrl = await generateQRCode(wineId);
  
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${wineName}-qrcode.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

