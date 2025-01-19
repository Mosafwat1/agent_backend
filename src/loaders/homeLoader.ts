import * as express from 'express';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { env } from '../env';

export const expressLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        const app = settings.getData('express_app'); // Retrieve the express instance
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
    }
};

export const homeLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        const app = settings.getData('express_app'); // Retrieve the express instance
        
        // Existing route
        app.get(env.app.routes.prefix, (req: express.Request, res: express.Response) => {
            return res.json({
                name: env.app.name,
                version: env.app.version,
                description: env.app.description,
            });
        });

        // New "Hello, Data!" route
        app.get('/', (req: express.Request, res: express.Response) => {
            res.send('Hello, Data!');
        });
    }
};
