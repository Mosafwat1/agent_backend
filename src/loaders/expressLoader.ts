import { json, urlencoded } from 'body-parser';
import { createNamespace } from 'continuation-local-storage';
import express from 'express';
import { ServerResponse } from 'http';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { useExpressServer } from 'routing-controllers';

import { env } from '../env';

export const expressLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        const expressApp = express();

        // Middleware for handling raw body
        const rawBodySaver = (req: any, res: ServerResponse, buf: Buffer, encoding: string) => {
            if (buf && buf.length) {
                req.rawBody = buf.toString(encoding || 'utf8');
            }
        };

        expressApp.use(json({ verify: rawBodySaver, limit: '100mb' }));
        expressApp.use(urlencoded({ extended: true, limit: '100mb' }));

        // Configure routes using routing-controllers
        useExpressServer(expressApp, {
            cors: true,
            classTransformer: true,
            routePrefix: env.app.routes.prefix,
            defaultErrorHandler: false,
            controllers: env.app.dirs.controllers,
            middlewares: env.app.dirs.middlewares,
            interceptors: env.app.dirs.interceptors,
        });

        // Add a "Hello, Data!" route directly here for simplicity
        expressApp.get('/', (req, res) => {
            res.send('Hello, Data!');
        });

        // Start the server if not in test environment
        if (!env.isTest) {
            const server = expressApp.listen(env.app.port, () => {
                console.log(`Server running at http://localhost:${env.app.port}`);
            });
            settings.setData('express_server', server);
        }

        // Share the express app instance with other loaders
        settings.setData('express_app', expressApp);

        // Create a namespace for continuation-local-storage
        createNamespace('agent-api');
    }
};
