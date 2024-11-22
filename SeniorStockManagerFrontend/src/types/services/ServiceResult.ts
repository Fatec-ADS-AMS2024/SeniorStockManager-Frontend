export default class ServiceResult<T> {
    code: number;
    message?: string;
    data?: T;

    constructor(code: number, message?: string, data?: T) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}