import _ from 'lodash';
import { Service } from 'typedi';
import { env } from '../../../../env';
import { Logger, LoggerInterface } from '../../../../decorators/Logger';
import { IProvider } from '../../../wrappers/providers/IProvider';
import { ProviderFactory } from '../../../wrappers/providers/handler/ProviderFactory';
import { HttpError } from 'routing-controllers';

@Service()
export class AgentService {
    private readonly provider: IProvider;

    constructor(
        providerFactory: ProviderFactory,
        @Logger(__filename) private log: LoggerInterface
    ) {
        if (_.isNil(providerFactory)) {
            throw new Error('no providers are available');
        }
        this.provider = providerFactory.getInstance('utp');
    }

    public async requestOtp(mobileNumber: string, isRetry: boolean = false): Promise<any> {
        try {
             return this.provider.dispatch('requestOtp', {
                payload: {
                    request : {
                        mobileNumber,
                        isRetry,
                    },
                    signature: env.providers.utp.signature,
                },
             });
        } catch (error) {
            this.log.error('Failed to validate otps', { error});
            throw new HttpError(400, 'Failed to validate otps');
        }
    }

    public async verifyOtp(mobileNumber: string, otp: string): Promise<any> {
        try {
             return this.provider.dispatch('validateOtp', {
                payload: {
                    request : {
                        mobileNumber,
                        otp,
                    },
                    signature: env.providers.utp.signature,
                },
             });
        } catch (error) {
            this.log.error('Failed to validate otps', { error});
            throw new HttpError(400, 'Failed to validate otps');
        }
    }

    public async validateNumbers(): Promise<any> {
        try {
             return this.provider.dispatch('validateNumbers');
        } catch (error) {
            this.log.error('Failed to validate numbers', { error});
            throw new HttpError(400, 'Failed to validate numbers');
        }
    }

    public async validateOtps(): Promise<any> {
        try {
             return this.provider.dispatch('validateOtps');
        } catch (error) {
            this.log.error('Failed to validate otps', { error});
            throw new HttpError(400, 'Failed to validate otps');
        }
    }
}
