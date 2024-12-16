import { ProviderRequestConfig } from '../types';
import { env } from '../../../env';

export default {
    key: 'utp',
    baseUrl: env.providers.utp.api,
    baseHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    requests: new Map<string, ProviderRequestConfig>([
        ['validateNumbers', {
            path: '/secure/agent/valid-numbers',
            method: 'GET',
        }],
        ['validateOtps', {
            path: '/secure/agent/valid-otps',
            method: 'GET',
        }],
        ['requestOtp', {
            path: '/secure/agent/api/agent/request-otp',
            method: 'POST',
        }],
        ['validateOtp', {
            path: '/secure/agent/api/agent/validate-otp',
            method: 'POST',
        }],
        ['customer-profile', {
            path: '/secure/agent/api/customer/profile',
            method: 'POST',
        }],
        ['customer-upload', {
            path: '/secure/agent/api/customer/upload',
            method: 'POST',
        }],
        ['update-user-profile', {
            path: '/secure/agent/api/customer/update',
            method: 'PUT',
        }],
        ['register-user', {
            path: '/secure/agent/api/customer/register',
            method: 'POST',
        }],
        ['eod-report', {
            path: '/secure/agent/api/reports/end-of-day',
            method: 'POST',
        }],
    ]),
};
