import CryptoJS from "crypto-js";

const secretKey = process.env.REACT_APP_SECRET_KEY_ENCRIPTION;

export const encryptData = (data) => {
  const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
  return encryptedData;
};

export const decryptData = (encryptedData) => {
  if (!encryptedData) return null;
  const decryptData = CryptoJS.AES.decrypt(encryptedData, secretKey).toString(
    CryptoJS.enc.Utf8
  );
  return decryptData;
};
