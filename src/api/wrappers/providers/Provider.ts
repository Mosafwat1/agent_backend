import _ from 'lodash';
import { ProviderRequestHandlerFactory } from './handler/ProviderRequestHandlerFactory';
import { Service } from 'typedi';
import { HttpsClient } from '../httpRequest/HttpsClient';
import { ProviderConfig, ProviderRequestConfig } from '../types';
import { IProvider } from './IProvider';
import { Logger } from '../../../lib/logger';
import { buildUrl } from '../common/utlis';

export class Provider implements IProvider {
    private providerConfig: ProviderConfig;
    private readonly log = new Logger(__filename);

    constructor(@Service() private httpsClient: HttpsClient) { }

    public init(config: ProviderConfig): void {
        if (_.isNil(config)) {
        throw new Error('Invalid provider configuration');
        }

        this.providerConfig = config;
    }

    public async dispatch<T = any>(
        requestName: string,
        config?: ProviderRequestConfig
    ): Promise<T> {
        if (!this.providerConfig.requests.has(requestName)) {
            throw new Error('Provider request is not defined');
        }

        try {
            this.log.info('start dispatching provider', { data: {
                requestName,
                config,
            }});
            const requestConfig = this.providerConfig.requests.get(requestName);
            this.log.info('request Config', { data: { requestConfig }});
            const request = this.configureRequest(requestConfig, config);
            this.log.info('configured request ', { data: { request }});
            const response = await this.httpsClient.request<T>(request);
            this.log.info(`HTTP response for ${requestName}`, {
                data : { request, response: response.data },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    private configureRequest(requestConfig: ProviderRequestConfig, inputConfig: ProviderRequestConfig): any {
        if (!_.isEmpty(requestConfig.handler)) {
            const requestHandler = ProviderRequestHandlerFactory.create(requestConfig.handler);
            return requestHandler.handle(inputConfig);
        }

        const url = inputConfig.url ? `${inputConfig.url}${requestConfig.path}` : `${this.providerConfig.baseUrl}${requestConfig.path}`;
        return {
            url: buildUrl(url, inputConfig.urlParams),
            data: inputConfig.payload ?? requestConfig.payload,
            method: requestConfig.method,
            headers: inputConfig.headers ?? {
                ...this.providerConfig.baseHeaders,
                ...requestConfig.additionalHeaders,
                ...inputConfig.additionalHeaders,
            },
            params: inputConfig.queryStringParams,
        };
    }
}
