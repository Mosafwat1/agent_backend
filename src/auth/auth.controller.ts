import { Controller, Post, Body, Headers, HttpCode, UnauthorizedException } from '@nestjs/common';
import { GenericResponseDto } from '../Common/generic-response.dto';
import { OtpValidationResponse } from '../types/auth.types';
import { EndOfDayReportRequestDto } from '../user/dto/end-of-day-report.dto';


@Controller('api/auth')
export class AuthController {

    private static readonly validNumbers = ['01010101010', '01111111111'];
    private static readonly validOtps = ['123456', '654321'];
    private static readonly validTokens = ['utp123'];

    private static checkNumber(number: string): boolean {
        return this.validNumbers.includes(number);
    }

    @Post('login')
    @HttpCode(200)
    login(@Body() loginDto: { mobileNumber: string }): GenericResponseDto<boolean> {
        const isNumberValid = AuthController.checkNumber(loginDto.mobileNumber);

        return new GenericResponseDto(
            isNumberValid,
            isNumberValid ? null : 'User does not exist',
            isNumberValid
        );
    }

    @Post('validate-otp')
    @HttpCode(200)
    validateOtp(@Body() otpData: { otp: string; mobileNumber: string }): GenericResponseDto<OtpValidationResponse> {
        const isValid = AuthController.validOtps.includes(otpData.otp) &&
            AuthController.validNumbers.includes(otpData.mobileNumber);

        if (isValid) {
            const response: OtpValidationResponse = {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                fullName: 'John Doe',
                branchName: 'Main Branch',
                branchAddress: '123 Main St, City, Country',
                branchLat: 40.7128,
                branchLong: -74.0060
            };

            return new GenericResponseDto(true, null, response);
        } else {
            return new GenericResponseDto(false, 'Invalid OTP or mobile number', null);
        }
    }

    @Post('end-of-day')
    @HttpCode(200)
    endOfDayReport(
        @Body() requestData: EndOfDayReportRequestDto,  
        @Headers('authorization') authHeader: string
    ): any {
        
        const token = authHeader?.split(' ')[1];
        if (!token || !AuthController.validTokens.includes(token)) {
            return {
                status: 'failure',
                error: 'Invalid or missing token'
            };
        }

        
        const { isPageable, size, page, first } = requestData;

        const agentRequest = {
            from: "2023-10-02T10:15:30",
            to: "2024-11-02T10:15:30",
            isPageable: isPageable,
            size: size || 4,
            page: page || 0,
            sort_by: "arabicName",
            sort_direction: "ASC",
            signature: "abc123signature"
        };

        
        const agentResponse = {
            correlationid: "16f42d2a-b64b-4810-838f-00a8aa9ecee",
            status: "success",
            message: "We found a matched data",
            reportDetails: {
                content: [
                    { mobileNumber: null, natIDNumber: null, fullName: null, created: "2024-10-09T01:02:24.363688" },
                    { mobileNumber: "+201151535535", natIDNumber: "29310101301476", fullName: "محمد صبرى راشد", created: "2024-10-09T01:02:24.363688" },
                    { mobileNumber: "+201157887337", natIDNumber: "28804133100196", fullName: "ايهاب محمد علي", created: "2024-10-09T01:02:24.363688" },
                    { mobileNumber: null, natIDNumber: null, fullName: "محمد على مرسى", created: "2024-10-09T01:02:24.363688" }
                ],
                pageable: "INSTANCE",
                totalPages: 1,
                totalElements: 50,
                last: true,
                size: 50,
                number: 0,
                sort: { empty: true, sorted: false, unsorted: true },
                numberOfElements: 50,
                first: true,
                empty: false
            }
        };

        
        const mobileResponse = {
            status: agentResponse.status,
            data: {
                content: agentResponse.reportDetails.content
            }
        };

        return mobileResponse;
    }
}
