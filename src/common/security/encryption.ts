import { AES, enc } from 'crypto-js';

export const Encrypt = ({
  plainText,
  secret = process.env.SECRET_KEY as string,
}) => {
  return AES.encrypt(plainText, secret).toString();
};

export const Decrypt = ({
  plainText,
  secret = process.env.SECRET_KEY as string,
}) => {
  const bytes = AES.decrypt(plainText, secret);
  return JSON.parse(bytes.toString(enc.Utf8));
};
