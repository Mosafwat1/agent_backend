import _ from 'lodash';
import {Service} from 'typedi';
import { env } from '../../../env';
import { Logger, LoggerInterface } from '../../../decorators/Logger';
import { IProvider } from '../../wrappers/providers/IProvider';
import { ProviderFactory } from '../../wrappers/providers/handler/ProviderFactory';
import { HttpError } from 'routing-controllers';
import {
    UpdateUserDataRequest,
    UploadNationalIdRequest,
    RegisterUserRequest,
} from '../../controllers/api/customer/requests/UserRequests';

@Service()
export class CustomerService {
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

    public async customerProfile(token: string, reference: string, type: string = 'MOBILE'): Promise<any> {
        try {
             return this.provider.dispatch('customer-profile', {
                payload: {
                    request : {
                        reference,
                        type,
                    },
                    signature: env.providers.utp.signature,
                },
                headers: {
                    Authorization: token,
                },
             });
        } catch (error) {
            this.log.error('Failed to fetch kyc doc', { error});
            throw new HttpError(400, 'Failed to fetch kyc doc');
        }
    }

    public async saveKyc(token: string, businessId: string, kyc: string): Promise<any> {
        try {
             return this.provider.dispatch('customer-upload', {
                payload: {
                    request : {
                        businessId,
                        docs: {
                            docs: {
                                KYCForm: kyc,
                            },
                        },
                        signature: env.providers.utp.signature,
                    },
                },
                headers: {
                    Authorization: token,
                },
            });
        } catch (error) {
            this.log.error('Failed to fetch kyc doc', { error});
            throw new HttpError(400, 'Failed to fetch kyc doc');
        }
    }

    public async registerUser(token: string, request: RegisterUserRequest): Promise<any> {
        return this.provider.dispatch('register-user', {
            payload: {
                request,
                signature: env.providers.utp.signature,
            },
            headers: {
                Authorization: token,
            },
        });
    }

    public async updateProfileData(token: string, data: UpdateUserDataRequest): Promise<any> {
        try {
            return this.provider.dispatch('update-user-profile', {
                payload: {
                    request: {
                        businessId: data.userToken,
                        fullName: data.aName,
                        firstName: '',
                        englishFullName: data.eName,
                        workAddress: data.workAddress || '',
                        workOccupation: data.workOccupation || '',
                        natIDAddress: data.nidAddress || '',
                    },
                    signature: env.providers.utp.signature,
                },
                headers: {
                    Authorization: token,
                },
            });
        } catch (error) {
            this.log.error('Failed to update user profile', { error });
            throw new HttpError(400, 'Failed to update user profile');
        }
    }

    public async saveNatIdToMiniIO(token: string, data: UploadNationalIdRequest): Promise<any> {
        try {
            return this.provider.dispatch('customer-upload', {
                payload: {
                    request: {
                        businessId: data?.businessId,
                        docs: {
                            NatFront: data.natFront,
                            NatBack: data.natBack,
                        },
                    },
                    signature: env.providers.utp.signature,
                },
                headers: {
                    Authorization: token,
                },
            });
        } catch (error) {
            this.log.error('Failed to upload national ID documents', { error });
            throw new HttpError(400, 'Failed to upload national ID documents');
        }
    }
}
