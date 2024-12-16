import { HttpError } from 'routing-controllers';
import IProviderRequestHandler from './IProviderRequestHandler';

export class ProviderRequestHandlerFactory {
  /**
   * Creates provider request handler factory
   * @param key string
   * @returns IProviderRequestHandler
   */
  public static create(key: string): IProviderRequestHandler {
    switch (key) {
      // handlers goes there...
      default:
      throw new HttpError(400, 'Out of range request handler');
    }
  }
}
