import * as helper from "encrypted-nestjs";
import * as nest from "@nestjs/common";
import { assertType } from "typescript-is";

import { IIamportUser } from "../api/structures/IIamportUser";

import { FakeIamportUserAuth } from "../providers/FakeIamportUserAuth";
import { IIamportResponse } from "../api/structures/IIamportResponse";
import { FakeIamportResponseProvider } from "../providers/FakeIamportResponseProvider";

@nest.Controller("users")
export class FakeIamportUsersController
{
    @helper.TypedRoute.Post("getToken")
    public getToken
        (
            @nest.Body() input: IIamportUser.IAccessor
        ): IIamportResponse<IIamportUser>
    {
        assertType<typeof input>(input);
        
        const user: IIamportUser = FakeIamportUserAuth.issue(input);
        return FakeIamportResponseProvider.returns(user);
    }
}