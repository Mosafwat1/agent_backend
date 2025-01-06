import { DataSource } from 'typeorm';
import { env } from './src/env';

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: env.db.url,
    synchronize: env.db.synchronize,
    migrationsRun: false,
    entities: env.app.dirs.entities,
    migrations: env.app.dirs.migrations,
    ssl: {
        rejectUnauthorized: false,
    },
});
