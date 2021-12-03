import { IIamportResponse } from "../api/structures/IIamportResponse";

export namespace FakeIamportResponseProvider
{
    export function success<T extends object>
        (response: T): IIamportResponse<T>
    {
        return {
            code: 0,
            message: "success",
            response
        };
    }
}