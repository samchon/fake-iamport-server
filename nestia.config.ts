import type nestia from "nestia";

export const NESTIA_CONFIG: nestia.IConfiguration = {
    input: "src/controllers",
    output: "src/api",
    swagger: {
        output: "dist/swagger.json"
    }
};
export default NESTIA_CONFIG;