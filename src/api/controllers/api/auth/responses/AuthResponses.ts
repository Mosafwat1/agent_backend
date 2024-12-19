import { GenericResponseDto } from '../../responses/SuccessMsgResponse';

export class LoginResponse extends GenericResponseDto<any> {
    constructor() {super(true, 'OTP has been sent successfully to your mobile number', true); }
}

export class VerifyOtpResponse extends GenericResponseDto<{
    token: string;
    fullName: string;
    branchName: string;
    branchAddress: string;
    branchLat: number;
    branchLong: number;
}> {
    constructor(
        token: string,
        fullName: string,
        branchName: string,
        branchAddress: string,
        branchLat: number,
        branchLong: number
    ) {
        super(true, 'OTP verified successfully', {
            token,
            fullName,
            branchName,
            branchAddress,
            branchLat,
            branchLong,
        });
    }
}
