export interface IIamportUser
{
    now: number;
    expired_at: number;
    access_token: string;
}
export namespace IIamportUser
{
    export interface IAccessor
    {
        imp_key: string;
        imp_secret: string;
    }
}