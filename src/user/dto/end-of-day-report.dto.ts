import { IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class EndOfDayReportRequestDto {
    @IsString()
    from: string;

    @IsString()
    to: string;

    @IsBoolean()
    isPageable: boolean;

    @IsNumber()
    size: number;

    @IsNumber()
    page: number;

    @IsString()
    sort_by: string;

    @IsString()
    sort_direction: string;

    @IsString()
    signature: string;
}
