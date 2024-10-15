import { IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class EndOfDayReportRequestDto {
    @IsString()
    @IsOptional()
    from?: string;

    @IsString()
    @IsOptional()
    to?: string;

    @IsBoolean()
    isPageable: boolean;

    @IsNumber()
    size: number;

    @IsNumber()
    page: number;

    @IsString()
    @IsOptional()
    sort_by?: string;

    @IsString()
    @IsOptional()
    sort_direction?: string;

    @IsString()
    @IsOptional()
    signature?: string;

    @IsBoolean()
    @IsOptional()
    first?: boolean;

}