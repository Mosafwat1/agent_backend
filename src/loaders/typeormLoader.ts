import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { AppDataSource } from '../../data-source';

export const typeormLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
    const connection = await AppDataSource.initialize();
    console.log('Database connection established successfully!');

    if (settings) {
        settings.setData('connection', connection);
        settings.onShutdown(() => connection.destroy());
    }
};
