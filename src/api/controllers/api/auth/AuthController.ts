import { JsonController, Body, Post } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { AgentService } from '../../../services/api/auth/AgentService';
import { ValidateService } from '../../../services/validation/ValidateService';
import { LoginAgent, VerifyOtp } from './requests/AuthRequests';
import { LoginResponse, VerifyOtpResponse } from './responses/AuthResponses';

@JsonController('/api/auth')
@OpenAPI({ security: [{ basicAuth: [] }] })
export class AuthController {

    constructor(
        private agentService: AgentService,
        private validator: ValidateService
    ) { }

    @Post('/login')
    @Post('/login_S')
    public async login(@Body() body: LoginAgent): Promise<LoginResponse> {
        await this.validator.validateBody(body);
        await this.agentService.requestOtp(body.mobileNumber, false);
        return {
            isSuccess: true,
            message: 'OTP has been sent successfully to your mobile number',
        };
    }

    @Post('/otp/verify')
    @Post('/validate-otp')
    public async verify(@Body() body: VerifyOtp): Promise<VerifyOtpResponse> {
        await this.validator.validateBody(body);
        const verifyRes = await this.agentService.verifyOtp(body.mobileNumber, body.otp);
        const agentDetails = verifyRes.agentDetails;
        const assignedBranch = agentDetails.assignedBranch;

        return {
            token: verifyRes.accessToken,
            fullName: agentDetails.agentName,
            branchName: assignedBranch.branchName,
            branchAddress: assignedBranch.branchAddress,
            branchLat: assignedBranch.branchLat,
            branchLong: assignedBranch.branchLong,
        };
    }
}
