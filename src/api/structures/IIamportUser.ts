export interface IIamportUser
{
    /**
     * 토큰 발행 시간.
     */
    now: number;

    /**
     * 토큰 만료 시간.
     * 
     * 리눅스 타임이 기준이며, 이를 JS 에서 사용하려거든, 아래와 같이 변환해야 한다.
     * 
     * ```typescript
     * new Date(user.expired_at * 1_000);
     * ```
     */
    expired_at: number;

    /**
     * 유저 인증 토큰.
     */
    access_token: string;
}
export namespace IIamportUser
{
    /**
     * 아임포트에서 부여해 준 API 및 secret 키.
     */
    export interface IAccessor
    {
        /**
         * API 키.
         */
        imp_key: string;

        /**
         * Secret 키.
         */
        imp_secret: string;
    }
}