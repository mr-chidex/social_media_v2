import bcrypt from 'bcrypt';

export default async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPass = await bcrypt.hash(password, salt);
    return hashedPass;
  } catch (error: any) {
    throw new Error('error hashing password');
  }
};
