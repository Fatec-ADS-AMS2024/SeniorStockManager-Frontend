export default class ServiceResult<T> {
    code: number;
    message?: string;
    data?: T;

    constructor(code: number, message?: string, data?: T) {
        this.code = code;
        this.message = message;
        this.data = (data && typeof data === "object" && "data" in data)
            ? (data as { data: T }).data
            : (data as T);
    }
}