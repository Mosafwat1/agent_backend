import _ from 'lodash';

export function buildUrl(urlStr: string, params: object): string {
    if (_.isEmpty(params)) {
        return urlStr;
    }

    const tokens = urlStr.split('/');
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token[0] === '$') {
            const key = token.slice(1, token.length);
            if (!_.has(params, key)) {
                throw new Error(`Request {${urlStr}} url parameters do not contain key: ${key}`);
            }
            tokens[i] = _.get(params, key);
        }
    }

    return tokens.join('/');
}
