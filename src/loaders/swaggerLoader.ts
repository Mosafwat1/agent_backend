import {
    defaultMetadataStorage as classTransformerMetadataStorage,
} from 'class-transformer/storage';
import { getFromContainer, MetadataStorage } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import basicAuth from 'express-basic-auth';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUi from 'swagger-ui-express';

import { env } from '../env';

export const swaggerLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings && env.swagger.enabled) {
        const expressApp = settings.getData('express_app');

        const { validationMetadatas } = getFromContainer(
            MetadataStorage
        ) as any;

        // Generate schemas with a type assertion to avoid type errors
        const schemas = validationMetadatasToSchemas(validationMetadatas, {
            classTransformerMetadataStorage,
            refPointerPrefix: '#/components/schemas/',
        }) as { [key: string]: Record<string, unknown> };

        // Generate the Swagger file
        const swaggerFile = routingControllersToSpec(
            getMetadataArgsStorage(),
            {},
            {
                components: {
                    schemas,
                    securitySchemes: {
                        basicAuth: {
                            type: 'http',
                            scheme: 'basic',
                        },
                    },
                },
            }
        );

        // Add application metadata to the Swagger file
        swaggerFile.info = {
            title: env.app.name,
            description: env.app.description,
            version: env.app.version,
        };

        // Add server details
        swaggerFile.servers = [
            {
                url: `${env.app.schema}://${env.app.host}:${env.app.port}`,
            },
        ];

        // Set up Swagger UI with optional basic auth
        expressApp.use(
            env.swagger.route,
            env.swagger.username
                ? basicAuth({
                      users: {
                          [`${env.swagger.username}`]: env.swagger.password,
                      },
                      challenge: true,
                  })
                : (req, res, next) => next(),
            swaggerUi.serve,
            swaggerUi.setup(swaggerFile)
        );
    }
};
