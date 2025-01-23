import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';

export class GenericResponseDto<T> {
    public isSuccess: boolean;
    public message: string;
    public data?: any;

    constructor(isSuccess: boolean, message: string, data?: T) {
        this.isSuccess = isSuccess;
        this.message = message;
        if (data) {
            const { encryptedData, encryptedKey } = this.encryptData(data);
            this.data = {
                key: encryptedKey,
                result: encryptedData,
            };
        }
    }

    private encryptData(data: any): { encryptedData: string, encryptedKey: string } {
        try {
            // 1. Generate AES key for symmetric encryption
            const aesKey = crypto.randomBytes(32); // AES-256 key

            // 2. Encrypt the data using AES (AES-256-CBC)
            const iv = crypto.randomBytes(16); // Initialization vector
            const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
            let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
            encrypted += cipher.final('base64');

            // 3. Encrypt the AES key using the RSA public key
            const publicKeyPath = path.join(__dirname, '..', '..', '..', '..', 'keys', 'public.pem');
            const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
            const encryptedKey = crypto.publicEncrypt(
                {
                    key: publicKey,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                    oaepHash: 'sha256',
                },
                aesKey
            ).toString('base64');

            return { encryptedData: `${iv.toString('base64')}:${encrypted}`, encryptedKey };
        } catch (error) {
            console.error('Error encrypting data:', error);
            throw new Error('Failed to encrypt data');
        }
    }
}
