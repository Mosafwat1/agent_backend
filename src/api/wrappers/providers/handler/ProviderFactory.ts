import { Service } from 'typedi';
import { HttpsClient } from '../../httpRequest/HttpsClient';
import { Provider } from '../Provider';
import { Configs } from '../../configs';
import { IProvider } from '../IProvider';

export interface IProviderFactory {
  getInstance(configKey: string): IProvider;
}

@Service()
export class ProviderFactory implements IProviderFactory {
  private readonly providers = new Map<string, IProvider>();

  /**
   * Gets or create a provider based on config key
   * @param configKey string
   * @returns IProvider
   */
  public getInstance(configKey: string): IProvider {
    if (this.providers.has(configKey)) {
      return this.providers.get(configKey);
    }

    const config = Configs.find(con => con.key === configKey);
    if (!config) {
      throw new Error('Provider key not found');
    }

    const provider = new Provider(new HttpsClient());
    provider.init(config);
    this.providers.set(configKey, provider);
    return provider;
  }
}
