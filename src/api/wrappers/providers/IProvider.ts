import { ProviderConfig, ProviderRequestConfig } from '../types';

export interface IProvider {
    init(config: ProviderConfig): void;
    dispatch<T = any>(
        requestName: string,
        config?: ProviderRequestConfig
    ): Promise<T>;
}
