import AbstractApiRequest from "./AbstractApiRequest";

class CustomersApiRequest extends AbstractApiRequest {
    config = {
        entity: "customers",
    };
    constructor() {
        super();
    }
}

export default CustomersApiRequest;
