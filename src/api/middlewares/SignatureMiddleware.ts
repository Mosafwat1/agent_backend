import * as express from 'express';
import * as crypto from 'crypto';
import { ExpressMiddlewareInterface } from 'routing-controllers';

// @Middleware({ type: 'before' })
export class SignatureMiddleware implements ExpressMiddlewareInterface {

    public use(req: express.Request, res: express.Response, next: express.NextFunction): any {

        try {
            const { secret } = req.headers;
            const { data } = req.body || process.env.SIGNATURE_KEY;
            const signature = crypto.createHmac('sha256', process.env.SIGNATURE_SECRET).update(data).digest('hex');

            // key unused right now
            if (!data || !secret || signature !== secret) {
                throw new Error('Bad Request');
            }

            return next();
        } catch (err) {
            return res.status(400).json({
                isSuccess: false,
                message: 'Bad Request',
            });
        }
    }

}
