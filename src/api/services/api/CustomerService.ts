import _ from 'lodash';
import {Service} from 'typedi';
import { env } from '../../../env';
import { Logger, LoggerInterface } from '../../../decorators/Logger';
import { IProvider } from '../../wrappers/providers/IProvider';
import { ProviderFactory } from '../../wrappers/providers/handler/ProviderFactory';
import { HttpError } from 'routing-controllers';
import { parseGender, parsePlaceOfBirth, parseBirthDate } from '../../services/helpers/IdInfo';
import { RegisterUserRequest } from '../../controllers/api/customer/requests/UserRequests';

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

    public async registerUser(token: string, request: RegisterUserRequest): Promise<any> {
        try {
            return this.provider.dispatch('register-user', {
               payload: {
                request,
                signature: env.providers.utp.signature,
            },
            headers: {
                Authorization: token,
            }});
        } catch (error) {
            this.log.error('Failed to fetch kyc doc', { error});
            throw new HttpError(400, 'Failed to fetch kyc doc');
        }
    }

    public async customerProfile(token: string, reference: string, type: string = 'MOBILE'): Promise<any> {
        try {
            const profileResponse = await this.provider.dispatch('customer-profile', {
                payload: {
                    request: {
                        reference,
                        type,
                    },
                    signature: env.providers.utp.signature,
                },
                headers: {
                    Authorization: token,
                },
            });

            const customerProfile = profileResponse.customerProfile;
            customerProfile.isTopUp = false;
            const idNumber = customerProfile.natIDNumber;

            if (!customerProfile.gender) {
                customerProfile.gender = parseGender(idNumber);
            }

            if (!customerProfile.birthdate) {
                customerProfile.birthdate = parseBirthDate(idNumber);
            }

            if (!customerProfile.placeOfBirth) {
                customerProfile.placeOfBirth = parsePlaceOfBirth(idNumber);
            }

            return profileResponse;
        } catch (error) {
            this.log.error('Failed to fetch customer profile', { error });
            throw new HttpError(400, 'Failed to fetch customer profile');
        }
    }

    public async kycDoc(token: string, reference: string, type: string = 'businessId'): Promise<any> {
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
                        docs: { KYCForm: kyc },
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
    public async updateProfileData(
        token: string,
        userToken: string,
        firstNameAr: string,
        firstNameEn: string,
        lastNameAr: string,
        lastNameEn: string,
        workAddress?: string,
        workOccupation?: string,
        nidAddress?: string
    ): Promise<any> {
        try {
            return this.provider.dispatch('update-user-profile', {
                payload: {
                    request: {
                        businessId: userToken,
                        firstNameAr,
                        firstNameEn,
                        lastNameAr,
                        lastNameEn,
                        workAddress: workAddress || '',
                        workOccupation: workOccupation || '',
                        natIDAddress: nidAddress || '',
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

    public async saveNatIdToMiniIO(payload: {
        token: string,
        natFrontBase64: string,
        natBackBase64: string,
        businessId: string }): Promise<any> {
        try {
            return this.provider.dispatch('customer-upload', {
                payload: {
                    request: {
                        businessId: payload.businessId,
                        docs: {
                            NatFront: payload.natFrontBase64,
                            NatBack: payload.natBackBase64,
                        },
                    },
                    signature: 'abc123signature',
                },
                headers: {
                    Authorization: payload.token,
                },
            });
        } catch (error) {
            this.log.error('Failed to upload national ID documents', { error });
            throw new HttpError(400, 'Failed to upload national ID documents');
        }
    }

}
