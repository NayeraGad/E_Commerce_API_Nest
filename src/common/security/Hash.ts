import * as bcrypt from 'bcrypt';

export const Hash = ({
  plainText,
  saltRounds = Number(process.env.SALT_ROUNDS),
}) => {
  return bcrypt.hashSync(plainText, saltRounds);
};

export const Compare = ({
  plainText,
  hashedText,
}: {
  plainText: string;
  hashedText: string;
}) => {
  return bcrypt.compareSync(plainText, hashedText);
};
