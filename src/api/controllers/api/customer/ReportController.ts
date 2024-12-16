import { JsonController, Body, Post, HeaderParam, UseBefore, Get } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import * as path from 'path';
import { ReportService } from '../../../services/api/ReportService';
import { ValidateService } from '../../../services/validation/ValidateService';
import { PdfService } from '../../../services/helpers/PdfService';
import { EODReportRequest } from './requests/ReportRequests';
import { CustomerAuthorizationMiddleware } from '../../../middlewares/CustomerAuthorizationMiddleware';

@JsonController('/api/reports')
@OpenAPI({ security: [{ basicAuth: [] }] })
export class ReportController {

    constructor(
        private reportService: ReportService,
        private pdfService: PdfService,
        private validator: ValidateService
    ) { }

    @Post('/end-of-day')
    @UseBefore(CustomerAuthorizationMiddleware)
    public async EODReport(@HeaderParam('Authorization') token: string, @Body() body: EODReportRequest): Promise<any> {
        await this.validator.validateBody(body);
        return this.reportService.EODReport(token, body);
    }

    @Get('/print-end-of-day')
    @UseBefore(CustomerAuthorizationMiddleware)
    public async EODReportPrint(@HeaderParam('Authorization') token: string): Promise<any> {
        const reportData = await this.reportService.retrieveReport(token);
        const templatePath = path.join(__dirname, '..', '..', '..', 'templates', 'eodReport.hbs');
        const encodedPdf = await this.pdfService.encodedPdf(templatePath, reportData);
        return {
            isSuccess: true,
            message: 'Report generated successfully',
            data: encodedPdf,
        };
    }

}
