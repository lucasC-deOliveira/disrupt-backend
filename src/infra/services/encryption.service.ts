
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly encryptionKey: Buffer;
  private readonly iv: Buffer;

  constructor() {
    const key = process.env.ENCRYPTION_KEY;
    const iv = process.env.ENCRYPTION_IV;

    if (!key || !iv) {
      throw new Error('ENCRYPTION_KEY or ENCRYPTION_IV not defined.');
    }

    this.encryptionKey = Buffer.from(key, 'hex');
    this.iv = Buffer.from(iv, 'hex');

    if (this.encryptionKey.length !== 32) {
      throw new Error(`ENCRYPTION_KEY must be 32 bytes (64 hex characters), got ${this.encryptionKey.length}.`);
    }

    if (this.iv.length !== 16) {
      throw new Error(`ENCRYPTION_IV must be 16 bytes (32 hex characters), got ${this.iv.length}.`);
    }
  }

  encrypt(buffer: Buffer): Buffer {
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, this.iv);
    return Buffer.concat([cipher.update(buffer), cipher.final()]);
  }

  decrypt(buffer: Buffer): Buffer {
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey, this.iv);
    return Buffer.concat([decipher.update(buffer), decipher.final()]);
  }
}
