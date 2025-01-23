import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class EODReportRequest {

    @IsBoolean()
    @IsNotEmpty()
    public isPageable: boolean;

    @IsNumber()
    @IsNotEmpty()
    public size: number;

    @IsNumber()
    @IsNotEmpty()
    public page: number;

    @IsOptional()
    public sortBy?: string;

    @IsOptional()
    public sortDirection?: string;

    @IsOptional()
    public from?: string;

    @IsOptional()
    public to?: string;

}
