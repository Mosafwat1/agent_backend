import * as express from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';

export class CustomerAuthorizationMiddleware implements ExpressMiddlewareInterface {
    public use(req: express.Request, res: express.Response, next: express.NextFunction): any {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({
                message: 'Unauthorized Action',
            });
        }

        req.headers.authorization = authorization?.split(' ')[1];
        next();
    }

}
