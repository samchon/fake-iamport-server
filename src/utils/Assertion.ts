import { assertType } from "typescript-is";

import { IIamportCardPayment } from "../api/structures/IIamportCardPayment";
import { IIamportPayment } from "../api/structures/IIamportPayment";
import { IIamportTransferPayment } from "../api/structures/IIamportTransferPayment";
import { IIamportVBankPayment } from "../api/structures/IIamportVBankPayment";

export namespace Assertion {
    export function payment(input: IIamportPayment): void {
        assertType<{ pay_method: string }>(input);

        if (input.pay_method === "card") assertType<IIamportCardPayment>(input);
        else if (input.pay_method === "samsung")
            assertType<IIamportCardPayment>(input);
        else if (input.pay_method === "trans")
            assertType<IIamportTransferPayment>(input);
        else if (input.pay_method === "vbank")
            assertType<IIamportVBankPayment>(input);
        else
            assertType<
                IIamportPayment.IBase<
                    Exclude<
                        IIamportPayment.PayMethod,
                        "card" | "samsung" | "trans" | "vbank"
                    >
                >
            >(input);
    }
}
