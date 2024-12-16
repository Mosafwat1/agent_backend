import { JsonController, Body, Post, HeaderParam, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CustomerService } from '../../../services/api/CustomerService';
import { ValidateService } from '../../../services/validation/ValidateService';
import { KycDocRequest, SaveKycDocRequest } from './requests/KycRequests';
import { CustomerAuthorizationMiddleware } from '../../../middlewares/CustomerAuthorizationMiddleware';
import {
    UpdateUserDataRequest,
    UploadNationalIdRequest,
    ReUploadNatIdRequest,
    UserDataRequest,
    RegisterUserRequest,
} from './requests/UserRequests';

@JsonController('/api/user')
@OpenAPI({ security: [{ basicAuth: [] }] })
export class CustomerController {

    constructor(
        private customerService: CustomerService,
        private validator: ValidateService
    ) { }

    @Post('/kyc-doc')
    @Post('/get-kyc-doc')
    @UseBefore(CustomerAuthorizationMiddleware)
    public async kycDoc(@HeaderParam('Authorization') token: string, @Body() body: KycDocRequest): Promise<any> {
        await this.validator.validateBody(body);
        return this.customerService.customerProfile(token, body.userToken, 'businessId');
    }

    @Post('/save-kyc')
    @UseBefore(CustomerAuthorizationMiddleware)
    public async savKkycDoc(@HeaderParam('Authorization') token: string, @Body() body: SaveKycDocRequest): Promise<any> {
        await this.validator.validateBody(body);
        return this.customerService.saveKyc(token, body.businessId, body.kyc);
    }

    @Post('/get-user-data')
    @UseBefore(CustomerAuthorizationMiddleware)
    public async geteUserData(@HeaderParam('Authorization') token: string, @Body() body: UserDataRequest): Promise<any> {
        await this.validator.validateBody(body);
        return this.customerService.customerProfile(token, body.mobileNumber);
    }

    @Post('/register')
    @UseBefore(CustomerAuthorizationMiddleware)
    public async register(@HeaderParam('Authorization') token: string, @Body() body: RegisterUserRequest): Promise<any> {
        await this.validator.validateBody(body);
        return this.customerService.registerUser(token, body);
    }

    @Post('/update-user-data')
    @UseBefore(CustomerAuthorizationMiddleware)
    public async updateUserData(@HeaderParam('Authorization') token: string, @Body() body: UpdateUserDataRequest): Promise<any> {
        await this.validator.validateBody(body);
        return this.customerService.updateProfileData(token, body);
    }

    @Post('/upload-nat-id')
    @UseBefore(CustomerAuthorizationMiddleware)
    public async uploadNatId(
        @HeaderParam('Authorization') token: string,
        @Body() body: UploadNationalIdRequest
    ): Promise<any> {
        await this.validator.validateBody(body);
        return this.customerService.saveNatIdToMiniIO(token, body);
    }

    @Post('/reupload-nid')
    @UseBefore(CustomerAuthorizationMiddleware)
    public async reUploadNatId(
        @HeaderParam('Authorization') token: string,
        @Body() body: ReUploadNatIdRequest
    ): Promise<any> {
        await this.validator.validateBody(body);
        return this.customerService.saveNatIdToMiniIO(token, {
            natBack: body.nidBack,
            natFront: body.nidFront,
            businessId: body.userToken,
        });
    }
}
