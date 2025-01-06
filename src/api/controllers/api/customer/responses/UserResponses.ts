import { GenericResponseDto } from '../../responses/SuccessMsgResponse';

export class UpdateUserDataResponse extends GenericResponseDto<any> {
    constructor() {
        super(true, 'User data updated successfully', true);
    }
}

export class RegisterResponse extends GenericResponseDto<any> {
    constructor() {
        super(true, 'User data register successfully', true);
    }
}

export class UploadNatId extends GenericResponseDto<any> {
    constructor() {
        super(true, 'User national id uploaded successfully', true);
    }
}

export class GetUserData extends GenericResponseDto<any> {
    constructor() {
        super(true, 'User data register successfully', true);
    }
}

export interface OcrNidData {
    arabicName: string;
    englishName: string;
    nidNumber: string;
    nationality: string;
    address: string;
    gender: string;
    workOccupation: string;
    workAddress: string;
    birthdate: string;
    placeOfBirth: string;
    phoneNumber: string;
    status: string;
}

export interface UserDataResponse {
    ocrNidData: OcrNidData;
    isTopup: boolean;
    nidFrontUrl: string;
    nidBackUrl: string;
    userToken: string;
}

export interface UserBusinessId {
    businessId: string;
}
