import { JsonController, Body, Post, HeaderParam, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import * as path from 'path';
import { CustomerService } from '../../../services/api/CustomerService';
import { ValidateService } from '../../../services/validation/ValidateService';
import { KycDocRequest, SaveKycDocRequest } from './requests/KycRequests';
import { PdfService } from '../../../services/helpers/PdfService';
import {
    UpdateUserDataRequest,
    UploadNatIdRequest,
    ReUploadNatIdRequest,
    RegisterUserRequest,
    UserDataRequest,
    UserBusinessIdRequest,
} from './requests/UserRequests';
import { CustomerAuthorizationMiddleware } from '../../../middlewares/CustomerAuthorizationMiddleware';
import { KycResponse, SaveKycResponse } from './responses/KycResponses';
import { UpdateUserDataResponse } from './responses/UserResponses';
import { GenericResponseDto } from '../responses/SuccessMsgResponse';
import { UserService } from '../../../services/api/UserService';

@JsonController('/api/user')
@OpenAPI({ security: [{ basicAuth: [] }] })
export class CustomerController {

    constructor(
        private customerService: CustomerService,
        private userServices: UserService,
        private pdfService: PdfService,
        private validator: ValidateService
    ) { }

    @Post('/register')
    @UseBefore(CustomerAuthorizationMiddleware)
    public async register(@HeaderParam('Authorization') token: string, @Body() body: RegisterUserRequest): Promise<GenericResponseDto<any>> {
        await this.validator.validateBody(body);
        await this.customerService.registerUser(token, body);
        return new GenericResponseDto(true, 'Customer Registered Successfully', '');
    }

    @Post('/get-user-data')
    @UseBefore(CustomerAuthorizationMiddleware)
    public async geteUserData(@HeaderParam('Authorization') token: string, @Body() body: UserDataRequest): Promise<GenericResponseDto<any>> {
        await this.validator.validateBody(body);
        let data = undefined;
        try {
            data = await this.customerService.customerProfile(token, body.mobileNumber);
        } catch (err) {
            data = await this.userServices.getUserByMobileNumber(body.mobileNumber);
        }

        if (!data) {
            return new GenericResponseDto(false, 'Customer profile does not exist', '');
        }

        return new GenericResponseDto(true, 'Customer profile retrieved successfully', {
            ocrNidData: {
                firstNameAr: data?.customerProfile?.firstNameAr || '',
                lastNameAr: data?.customerProfile?.lastNameAr || '',
                firstNameEn: data?.customerProfile?.firstNameEn || data?.firstName || '',
                lastNameEn: data?.customerProfile?.lastNameEn || data?.lastName || '',
                nidNumber: data?.customerProfile?.natIDNumber || '',
                nationality: 'Egyptian',
                address: data?.customerProfile?.address || '',
                gender: data?.customerProfile?.gender === 'ذكر' ? '1' : '0',
                workOccupation: data?.customerProfile?.workOccupation || '',
                workAddress: data?.customerProfile?.workAddress || '',
                birthdate: data?.customerProfile?.birthdate || '',
                placeOfBirth: data?.customerProfile?.placeOfBirth || '',
                phoneNumber: data?.customerProfile?.mobileNumber || data?.phoneNumber || '',
                status: data?.customerProfile?.status || 'INITIATED',
            },
            isTopup: data?.customerProfile?.isTopUp || false,
            nidFrontUrl: data?.customerProfile?.nidFrontUrl || '',
            nidBackUrl: data?.customerProfile?.nidBackUrl || '',
            userToken: data?.customerProfile?.businessId || data?.referenceId || '',
        });
    }

    @Post('/kyc-doc')
    @Post('/get-kyc-doc')
    @UseBefore(CustomerAuthorizationMiddleware)
    public async kycDoc(@HeaderParam('Authorization') token: string, @Body() body: KycDocRequest): Promise<KycResponse> {
        await this.validator.validateBody(body);
        const customer = await this.customerService.kycDoc(token, body.userToken);
        const profile = customer?.customerProfile;
        profile.natIDNumbers = profile?.natIDNumber?.split('').reverse();
        const templatePath = path.join(__dirname, '..', '..', '..', 'templates', 'kycReport.hbs');
        const encodedPdf = await this.pdfService.encodedPdf(templatePath, profile);
        return new KycResponse(encodedPdf);
    }

    @Post('/save-kyc')
    @UseBefore(CustomerAuthorizationMiddleware)
    public async saveKycDoc(@HeaderParam('Authorization') token: string, @Body() body: SaveKycDocRequest): Promise<SaveKycResponse> {
        await this.validator.validateBody(body);
        const data = await this.customerService.saveKyc(token, body.businessId, body.kyc);
        return new GenericResponseDto(true, 'KYC form uploaded successfully', data?.result?.KYCFormDetails);
    }

    @Post('/update-user-data')
    @UseBefore(CustomerAuthorizationMiddleware)
    public async updateUserData(
        @HeaderParam('Authorization') token: string,
        @Body() body: UpdateUserDataRequest
    ): Promise<UpdateUserDataResponse> {
        await this.validator.validateBody(body);
        await this.customerService.updateProfileData(
            token,
            body.userToken,
            body.aName,
            body.eName,
            body.workAddress,
            body.workOccupation,
            body.nidAddress
        );
        return new UpdateUserDataResponse();
    }

    @Post('/upload-nat-id')
    @UseBefore(CustomerAuthorizationMiddleware)
    public async uploadNatId(
    @HeaderParam('Authorization') token: string,
    @Body() body: UploadNatIdRequest
    ): Promise<GenericResponseDto<any>> {
    await this.validator.validateBody(body);

        const data = await this.customerService.saveNatIdToMiniIO(
            body.natFront,
            body.natBack,
            body.businessId,
            token
        );
        return new GenericResponseDto(true, 'National ID uploaded successfully', data?.result);
    }

    @Post('/reupload-nid')
    @UseBefore(
        CustomerAuthorizationMiddleware
    )
    public async reuploadNid(
        @HeaderParam('Authorization') token: string,
        @Body() body: ReUploadNatIdRequest
    ): Promise<GenericResponseDto<any>> {
        await this.validator.validateBody(body);
        const data = await this.customerService.saveNatIdToMiniIO(
            token,
            body.nidFront,
            body.nidBack,
            body.userToken
        );
        return new GenericResponseDto(true, 'National ID re-uploaded successfully', data?.result);

    }

    @Post('/get-business-id')
    public async geteUserBusinessId(@Body() body: UserBusinessIdRequest): Promise<GenericResponseDto<any>> {
        await this.validator.validateBody(body);
        const userData = await this.userServices.getUserByMobileNumber(body.mobileNumber);
        return new GenericResponseDto(true, 'User business id fetched successfully', { businessId: userData?.referenceId });
    }
}
