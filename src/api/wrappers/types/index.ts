export interface ProviderRequestConfig {
    url?: string;
    path?: string;
    urlParams?: object;
    method?: 'POST' | 'PUT' | 'GET' | 'DELETE';
    headers?: object;
    additionalHeaders?: object;
    payload?: object;
    queryStringParams?: object;
    handler?: string;
}

export interface ProviderConfig {
    key: string;
    baseUrl?: string;
    baseHeaders?: object;
    baseParams?: object;
    requests: Map<string, ProviderRequestConfig>;
}

export interface IRequest {
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: object;
    params?: object;
    data?: object;
}
