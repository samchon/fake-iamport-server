/**
 * @packageDocumentation
 * @module api.functional.payments
 */
//================================================================
import { AesPkcs5 } from "./../../__internal/AesPkcs5";
import { Fetcher } from "./../../__internal/Fetcher";
import { Primitive } from "./../../Primitive";
import type { IConnection } from "./../../IConnection";

import type { IIamportResponse } from "./../../structures/IIamportResponse";
import type { IIamportPayment } from "./../../structures/IIamportPayment";
import type { IIamportPaymentCancel } from "./../../structures/IIamportPaymentCancel";


/**
 * 결제 기록 열람하기.
 * 
 * 아임포트를 통하여 발생한 결제 기록을 열람한다.
 * 
 * @param connection connection Information of the remote HTTP(s) server with headers (+encryption password)
 * @param imp_uid 대상 결제 기록의 {@link IIamportPayment.imp_uid}
 * @returns 결제 정보
 * 
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 * @controller FakeIamportPaymentsController.at()
 * @path GET /payments/:imp_uid
 */
export function at
    (
        connection: IConnection,
        imp_uid: string
    ): Promise<at.Output>
{
    return Fetcher.fetch
    (
        connection,
        at.CONFIG,
        at.METHOD,
        at.path(imp_uid)
    );
}
export namespace at
{
    export type Output = Primitive<IIamportResponse<IIamportPayment>>;


    export const METHOD = "GET";
    export const PATH = "/payments/:imp_uid";
    export const CONFIG = {
        input_encrypted: false,
        output_encrypted: false,
    };

    export function path(imp_uid: string): string
    {
        return `/payments/${imp_uid}`;
    }
}

/**
 * 결제 취소하기.
 * 
 * 만약 가상 계좌를 통한 결제였다면, 반드시 환불 계좌 정보를 입력해줘야 한다.
 * 
 * @param connection connection Information of the remote HTTP(s) server with headers (+encryption password)
 * @param input 결제 취소 입력 정보
 * @returns 취소된 결제 정보
 * 
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 * @controller FakeIamportPaymentsController.cancel()
 * @path POST /payments/cancel
 */
export function cancel
    (
        connection: IConnection,
        input: Primitive<cancel.Input>
    ): Promise<cancel.Output>
{
    return Fetcher.fetch
    (
        connection,
        cancel.CONFIG,
        cancel.METHOD,
        cancel.path(),
        input
    );
}
export namespace cancel
{
    export type Input = Primitive<IIamportPaymentCancel.IStore>;
    export type Output = Primitive<IIamportResponse<IIamportPayment>>;


    export const METHOD = "POST";
    export const PATH = "/payments/cancel";
    export const CONFIG = {
        input_encrypted: false,
        output_encrypted: false,
    };

    export function path(): string
    {
        return `/payments/cancel`;
    }
}



//---------------------------------------------------------
// TO PREVENT THE UNUSED VARIABLE ERROR
//---------------------------------------------------------
AesPkcs5;
Fetcher;
Primitive;
