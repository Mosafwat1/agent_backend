import axios, { AxiosRequestHeaders, AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { Service } from 'typedi';
import { Logger } from '../../../lib/logger';
import https from 'https';
import http from 'http';
import { HttpError } from 'routing-controllers';

@Service()
export class HttpsClient {
    private readonly client: AxiosInstance = axios.create({
        timeout: 120000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        httpsAgent: new https.Agent({
            keepAlive: true,
            rejectUnauthorized: false,
        }),
        httpAgent: new http.Agent({ keepAlive: true }),
    });

    private readonly log = new Logger(__filename);
    /**
     * Dispatches http request
     * @param config object
     * @returns Axiosresponse
     */
    public async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        try {
            const res = await this.client.request(config);
            return res;
        } catch (err: any) {
            console.log(err);
            throw new Error(err?.message || 'Error With sending an HTTP');
        }
    }

    public async post(url: string, body: object = {}, headers: object = {}): Promise<any> {
        try {
            const result = await this.client.post(url, body, {
                headers: headers as AxiosRequestHeaders,
            });

            if ( ! result ) {
                // update later within error handler task
                throw new Error('Unable to reach provider');
            }

            return result.data;

        } catch (error) {
            this.log.error('Error With External HTTP', { error });
            throw new Error('Error With External HTTP');
        }
    }

    public async get(url: string, headers: object = {}): Promise<any> {
        try {
            const result = await this.client.get(url, {
                headers: headers as AxiosRequestHeaders,
            });

            if ( ! result ) {
                throw new HttpError(400, 'Unable to reach provider');
            }

            return result.data;
        } catch (error) {
            this.log.error('Error With External HTTP', { error });
            throw new HttpError(400, 'Error With External HTTP');
        }
    }
}
