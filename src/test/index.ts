import { IamportConnector } from "../api/IamportConnector";
import { FakeIamportBackend } from "../FakeIamportBackend";
import { FakeIamportConfiguration } from "../FakeIamportConfiguration";

import { DynamicImportIterator } from "./internal/DynamicImportIterator";
import { ErrorUtil } from "../utils/ErrorUtil";

async function handle_error(exp: any): Promise<void> {
    ErrorUtil.toJSON(exp);
}

async function main(): Promise<void> {
    // BACKEND SERVER
    const backend: FakeIamportBackend = new FakeIamportBackend();
    await backend.open();

    // PARAMETER
    const connector: IamportConnector = new IamportConnector(
        `http://127.0.0.1:${FakeIamportConfiguration.API_PORT}`,
        {
            imp_key: "test_imp_key",
            imp_secret: "test_imp_secret",
        },
    );
    global.process.on("uncaughtException", handle_error);
    global.process.on("unhandledRejection", handle_error);

    // DO TEST
    const exceptions: Error[] = await DynamicImportIterator.force(
        __dirname + "/features",
        {
            prefix: "test",
            parameters: [connector],
        },
    );

    // TERMINATE
    await backend.close();

    if (exceptions.length === 0) console.log("Success");
    else {
        for (const exp of exceptions) console.log(exp);
        process.exit(-1);
    }
}
main().catch((exp) => {
    console.log(exp);
    process.exit(-1);
});
