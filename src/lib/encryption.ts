import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

function getKey(): Buffer {
  const secret = process.env.HOSTED_INSTANCE_ENCRYPTION_KEY;
  if (!secret) {
    throw new Error('HOSTED_INSTANCE_ENCRYPTION_KEY environment variable is not set');
  }
  
  // We hash the secret to ensure it's exactly 32 bytes for aes-256
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypts a string using AES-256-GCM.
 * Returns a single string containing IV, auth tag, and ciphertext, separated by colons.
 */
export function encryptToken(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getKey();
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts a token encrypted with encryptToken.
 */
export function decryptToken(encryptedData: string): string {
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted token format');
  }
  
  const [ivHex, tagHex, encryptedText] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const key = getKey();
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
