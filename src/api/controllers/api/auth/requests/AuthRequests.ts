import { IsMobilePhone, IsNotEmpty, IsString } from 'class-validator';

export class LoginAgent {

    @IsString()
    @IsNotEmpty()
    @IsMobilePhone('ar-EG')
    public mobileNumber: string;
}

export class VerifyOtp extends LoginAgent {

    @IsString()
    @IsNotEmpty()
    public otp: string;
}
