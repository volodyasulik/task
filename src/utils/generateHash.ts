import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export const generateHash = async (password: string) => {
  const salt = randomBytes(8).toString('hex');

  const hash = (await scrypt(password, salt, 32)) as Buffer;
  const resultSaltAndHash = `${salt}.${hash.toString('hex')}`;

  return resultSaltAndHash;
};
