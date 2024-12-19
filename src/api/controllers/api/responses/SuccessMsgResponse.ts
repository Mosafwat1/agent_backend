export class GenericResponseDto<T> {
    public isSuccess: boolean;
    public message: string;
    public data?: T;

    constructor(isSuccess: boolean, message: string, data?: T) {
        this.isSuccess = isSuccess;
        this.message = message;
        this.data = data;
    }
}
