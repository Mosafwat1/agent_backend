import { GenericResponseDto } from '../../responses/SuccessMsgResponse';

export class EODReportResponse extends GenericResponseDto<any> {
    constructor(data: any) {
        super(true, 'End of Day Report fetched successfully', data);
    }
}

export class EODReportPrintResponse extends GenericResponseDto<any> {
    constructor(data: any) {
        super(true, 'End of Day Report PDF generated successfully', data);
    }
}

export interface ReportDetails {
    created: string;
    mobileNumber: string;
    customerName: string;
    transactionCount: number;
    totalAmount: number;
}

export interface EODReportData {
    reportDetails: ReportDetails[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
}
