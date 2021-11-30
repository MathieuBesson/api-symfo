import Pagination from "components/Pagination";
import React, { useEffect, useState } from "react";
import CustomersApiRequest from "../services/Api/CustomersApiRequest";

const CustomersPageWithPagination = (props) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const itemsPerPage = 10;
    const customersApiRequest = new CustomersApiRequest();

    // For each page n° change reload data with search constrainst (or not)
    useEffect(() => {
        if (search !== "") {
            handleSearch(search);
        } else {
            fetchCustomers();
        }
    }, [currentPage]);

    // Get all customers
    const fetchCustomers = () => {
        customersApiRequest
            .findAllPerPage(itemsPerPage, currentPage)
            .then((response) => reloadCustomers(response))
            .catch((error) => console.log(error.response));
    };

    const handleDelete = (id) => {
        customersApiRequest
            .deleteItem(id)
            .then(() =>
                setCustomers(customers.filter((customer) => customer.id !== id))
            )
            .catch((error) => console.log(error.response));
    };

    const handlePageChange = (page) => {
        setLoading(true);
        setCurrentPage(page);
    };

    // Action on search field change
    const handleSearch = (value) => {
        setSearch(value);
        setLoading(true);

        // Reset current page to 1 on new search
        if (value !== search) {
            setCurrentPage(1);
        }

        // Fetch customers with search constraint
        if (value) {
            customersApiRequest
                .findAllPerSearch(value, itemsPerPage, currentPage)
                .then((response) => reloadCustomers(response))
                .catch((error) => console.log(error.response));
        } else {
            fetchCustomers();
        }
    };

    const reloadCustomers = (response) => {
        setCustomers(response.data);
        setTotalItems(response.totalItems);
        setLoading(false);
    };

    return (
        <div className="mt-5">
            <h1>Liste des Clients</h1>
            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher"
                    onChange={(e) => handleSearch(e.target.value)}
                    value={search}
                />
            </div>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Identifiant</th>
                            <th>Client</th>
                            <th>Email</th>
                            <th>Entrprise</th>
                            <th className="text-center">Factures</th>
                            <th className="text-center">Montant Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <th>Chargement...</th>
                            </tr>
                        )}
                        {!loading && customers.length === 0 && (
                            <tr>
                                <th>Pas de clients pour votre selection</th>
                            </tr>
                        )}
                        {!loading &&
                            customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.id}</td>
                                    <td>
                                        <a href="#">
                                            {customer.firstName}&nbsp;
                                            {customer.lastName}
                                        </a>
                                    </td>
                                    <td>{customer.email}</td>
                                    <td>{customer.company}</td>
                                    <td className="text-center">
                                        <span className="badge bg-primary">
                                            {customer.invoices.length}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        {customer.totalAmount.toLocaleString()}{" "}
                                        €
                                    </td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                handleDelete(customer.id)
                                            }
                                            disabled={
                                                customer.invoices.length > 0
                                            }
                                            className="btn btn-danger"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                {totalItems > itemsPerPage && (
                    <Pagination
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        length={totalItems}
                        onPageChanged={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default CustomersPageWithPagination;
