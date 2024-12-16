import { SuccessMessage } from '../../responses/SuccessMsgResponse';

export class LoginResponse extends SuccessMessage { }

export class VerifyOtpResponse {

    public token: string;
    public fullName: string;
    public branchName: string;
    public branchAddress: string;
    public branchLat: number;
    public branchLong: number;

}
