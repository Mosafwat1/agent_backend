import { GenericResponseDto } from '../../responses/SuccessMsgResponse';

export class KycResponse extends GenericResponseDto<any> {
    constructor(data: any) {
        super(true, 'KYC document retrieved successfully', data);
    }
}

export class SaveKycResponse extends GenericResponseDto<any> {
    constructor(data: any) {
        super(true, 'KYC document saved successfully', data);
    }
}
