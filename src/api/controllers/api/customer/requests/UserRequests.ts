import {  IsString, IsOptional, IsNotEmpty, IsEmail } from 'class-validator';

export class UpdateUserDataRequest {
    @IsString()
    @IsOptional()
    public aName: string;

    @IsString()
    @IsOptional()
    public eName: string;
 
    @IsString()
    @IsOptional()
    public workAddress?: string;

    @IsString()
    @IsOptional()
    public workOccupation?: string;

    @IsString()
    @IsOptional()
    public nidAddress: string;

    @IsString()
    public userToken: string;

    @IsString()
    @IsOptional()
    public firstNameAr?: string;

    @IsString()
    @IsOptional()
    public lastNameAr?: string;

    @IsString()
    @IsOptional()
    public firstNameEn?: string;

    @IsString()
    @IsOptional()
    public lastNameEn?: string;
}

export class UploadNatIdRequest {

    @IsString()
    public businessId: string;

    @IsString()
    public natFront: string;

    @IsString()
    public natBack: string;


}

export class ReUploadNatIdRequest {

    @IsString()
    public userToken: string;

    @IsString()
    public  nidFront: string;

    @IsString()
    public nidBack: string;


}

export class RegisterUserRequest {
    @IsString()
    @IsNotEmpty()
    public businessId: string;

    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsString()
    @IsNotEmpty()
    public mobileNumber: string;

    @IsString()
    @IsNotEmpty()
    public natFrontBase64: string;

    @IsString()
    @IsNotEmpty()
    public natBackBase64: string;

    @IsString()
    @IsNotEmpty()
    public natId: string;

    @IsString()
    @IsOptional()
    public firstNameAr?: string;

    @IsString()
    @IsOptional()
    public lastNameAr?: string;

    @IsString()
    @IsOptional()
    public firstNameEn?: string;

    @IsString()
    @IsOptional()
    public lastNameEn?: string;
}

export class UserDataRequest {
    @IsString()
    @IsNotEmpty()
    public mobileNumber: string;
}

export class customerProfile {
    @IsString()
    @IsNotEmpty()
    public refrence: string;

    @IsString()
    @IsNotEmpty()
    public type: "MOBILE"
}
