import AbstractApiRequest from "./AbstractApiRequest";

class InvoicesApiRequest extends AbstractApiRequest {
    config = {
        entity: "invoices",
        url: {
            getPerSearch: (search, itemsPerPage, currentPage) =>
                `http://192.168.88.188/api/${this.config.entity}?or_allField=${search}&pagination=true&count=${itemsPerPage}&page=${currentPage}`,
        },
    };

    constructor() {
        super();
    }
}

export default InvoicesApiRequest;
