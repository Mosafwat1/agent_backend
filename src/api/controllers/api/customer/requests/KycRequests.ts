import { IsNotEmpty, IsString } from 'class-validator';

export class KycDocRequest {

    @IsString()
    @IsNotEmpty()
    public userToken: string;
}

export class SaveKycDocRequest {

    @IsString()
    @IsNotEmpty()
    public businessId: string;

    @IsString()
    @IsNotEmpty()
    public kyc: string;
}
