import axios from "axios";
import AbstractClass from "services/Tools/AbstractClass";

class AbstractApiRequest extends AbstractClass {
    config = undefined;

    // Configuration of routes for all datas
    defaultConfig = {
        url: {
            getPaginate: (itemsPerPage, currentPage) =>
                `http://192.168.88.188/api/${this.config.entity}?pagination=true&count=${itemsPerPage}&page=${currentPage}`,
            getPerSearch: (search, itemsPerPage, currentPage) =>
                `http://192.168.88.188/api/${this.config.entity}?or_firstName_lastName_company_email=${search}&pagination=true&count=${itemsPerPage}&page=${currentPage}`,
            delete: (id) =>
                `http://192.168.88.188/api/${this.config.entity}/${id}`,
        },
    };

    constructor() {
        super();

        if (this.config?.entity) {
            new Error(
                `You must be implemeted or give data to this.config.entity`
            );
        }
    }

    /**
     * Find all but paginated
     * @param {number} itemsPerPage - Number of items per pages
     * @param {number} currentPage - Index of the current page
     * @returns
     */
    findAllPerPage(itemsPerPage = null, currentPage = null) {
        const url =
            itemsPerPage && currentPage
                ? this.defaultConfig.url.getPaginate(itemsPerPage, currentPage)
                : this.defaultConfig.url.get();

        return axios
            .get(url)
            .then((response) => this.getItemsAndQuantity(response));
    }

    /**
     * Find all but with specifical research
     * @param {string} search
     * @returns
     */
    findAllPerSearch(search, itemsPerPage, currentPage) {
        let url = null;
        console.log(itemsPerPage, currentPage);
        const urlNormal = this.config?.url?.getPerSearch(
            search,
            itemsPerPage,
            currentPage
        );
        if (urlNormal) {
            url = urlNormal;
        } else {
            url = this.defaultConfig.url.getPerSearch(
                search,
                itemsPerPage,
                currentPage
            );
        }

        return axios
            .get(url)
            .then((response) => this.getItemsAndQuantity(response));
    }

    /**
     * Delete specifical item by id
     * @param {number} id - Id of the future delete item
     * @returns
     */
    deleteItem(id) {
        return axios.delete(this.defaultConfig.url.delete(id));
    }

    /**
     * Get object of data and number of list items
     * @param {Object} response - Object of data and total Items
     * @returns
     */
    getItemsAndQuantity({ data }) {
        return {
            data: data["hydra:member"],
            totalItems: data["hydra:totalItems"],
        };
    }

    /**
     * Check existance of specifical configuiration element
     * @param {array} configurationItemList - List of config who should be present
     * @returns
     */
    checkConfigExist(configurationItemList) {
        let errorOnConfig = false;
        configurationItemList.forEach((configurationItem) => {
            if (configurationItem === undefined || configurationItem === null) {
                new Error(
                    `You must be implemeted or give data to ${configurationItem.toString()}`
                );
                errorOnConfig = true;
            }
        });

        return errorOnConfig;
    }
}

export default AbstractApiRequest;
