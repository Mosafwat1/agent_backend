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

    @Post('resend-otp')
    @HttpCode(200)
    resendOtp(@Body() resendData: { mobileNumber: string }): GenericResponseDto<boolean> {
        const isValidMobileNumber = AuthController.validNumbers.includes(resendData.mobileNumber);

        if (isValidMobileNumber) {
            return new GenericResponseDto(true, null, isValidMobileNumber);
        } else {
            return new GenericResponseDto(false, 'Failed to resend OTP. Invalid mobile number.', isValidMobileNumber);
        }
    }

    @Post('end-of-day')
    @HttpCode(200)
    endOfDayReport(
        @Body() requestData: EndOfDayReportRequestDto,  // Use DTO here
        @Headers('authorization') authHeader: string
    ): any {
        // Extract the Bearer token
        const token = authHeader?.split(' ')[1];
        if (!token || !AuthController.validTokens.includes(token)) {
            return {
                status: 'failure',
                error: 'Invalid or missing token'
            };
        }

        // Simulate a mock response for the report
        const reportContent = [
            { mobileNumber: null, natIDNumber: null, fullName: null, created: '2024-10-09T01:02:24.363688' },
            { mobileNumber: '+201151535535', natIDNumber: '29310101301476', fullName: 'محمد صبرى راشد', created: '2024-10-09T01:02:24.363688' },
            { mobileNumber: '+201157887337', natIDNumber: '28804133100196', fullName: 'ايهاب محمد علي', created: '2024-10-09T01:02:24.363688' },
            { mobileNumber: null, natIDNumber: null, fullName: 'محمد على مرسى', created: '2024-10-09T01:02:24.363688' }
        ];

        return {
            status: 'success',
            data: { content: reportContent }
        };
    }
}