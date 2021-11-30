export interface IIamportResponse<T extends object>
{
    code: number;
    message: string;
    response: T;
}