import axios from 'axios';

export const getQRCodeURL = async (wineId) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/wines/wine/qrCode/${wineId}`
  );
  // const response = await axios.get(
  //   `http://localhost:3000/api/wines/wine/qrCode/${wineId}`
  // );

  return response;
};
