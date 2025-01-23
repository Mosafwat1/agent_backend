import * as express from 'express';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class DecryptionMiddleware implements ExpressMiddlewareInterface {

    public use(req: express.Request, res: express.Response, next: express.NextFunction): any {

        if (req.method === 'GET') {
            return next();
        }

        try {
            const { data } = req.body;
            const privatePath = path.join(__dirname, '..', '..', 'keys', 'private.pem');
            const privateKey: string = fs.readFileSync(privatePath, 'utf8');
            const decryptedBuffer: Buffer = crypto.privateDecrypt(
                privateKey,
                Buffer.from(data, 'base64')
            );
            req.body = JSON.parse(decryptedBuffer.toString('utf8'));
            req.body.data = data;
            return next();
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                isSuccess: false,
                message: 'Bad Request',
            });
        }
    }

}
