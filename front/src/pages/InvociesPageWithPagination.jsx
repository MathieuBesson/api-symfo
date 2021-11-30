import Pagination from "components/Pagination";
import _, { set } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import InvoicesApiRequest from "../services/Api/InvoicesApiRequest";

const InvoicesPageWithPagination = (props) => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const itemsPerPage = 30;
    const invoicesApiRequest = new InvoicesApiRequest();

    // Class or labels for invoice status
    const STATUS_INFOS = {
        PAID: {
            CLASS: "success",
            LABEL: "Payée",
        },
        SENT: {
            CLASS: "primary",
            LABEL: "Envoyée",
        },
        CANCELLED: {
            CLASS: "danger",
            LABEL: "Annulée",
        },
    };

    // Status keys by labels
    const STATUS_LABELS = _.transform(
        STATUS_INFOS,
        (result, value, key) => {
            result[value.LABEL.toLowerCase()] = key;
        },
        {}
    );

    // For each page n° change reload data with search constrainst (or not)
    useEffect(() => {
        if (search !== "") {
            handleSearch(search);
        } else {
            fetchInvoices();
        }
    }, [currentPage]);

    // Get all invoices
    const fetchInvoices = () => {
        invoicesApiRequest
            .findAllPerPage(itemsPerPage, currentPage)
            .then((response) => reloadInvoices(response))
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

        // Fetch invoices with search constraint
        if (value) {
            const cleStatus = _.keys(STATUS_LABELS).filter((s) =>
                s.includes(value.trim().toLowerCase())
            )[0];
            value = cleStatus ? STATUS_LABELS[cleStatus] : value;

            invoicesApiRequest
                .findAllPerSearch(value, itemsPerPage, currentPage)
                .then((response) => reloadInvoices(response))
                .catch((error) => console.log(error.response));
        } else {
            fetchInvoices();
        }
    };

    // Delete invoice
    const handleDelete = (id) => {
        invoicesApiRequest
            .deleteItem(id)
            .then(() =>
                setInvoices(invoices.filter((invoice) => invoice.id !== id))
            )
            .catch((error) => console.log(error.response));
    };

    const reloadInvoices = (response) => {
        setInvoices(response.data);
        setTotalItems(response.totalItems);
        setLoading(false);
    };

    const formatDate = (str) => moment(str).format("DD/MM/YYYY");

    return (
        <div className="mt-5">
            <h1>Liste des Factures</h1>
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
                            <th>Numéro</th>
                            <th>Client</th>
                            <th className="text-center">Date d'envoi</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Montant</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <th>Chargement...</th>
                            </tr>
                        )}
                        {!loading && invoices.length === 0 && (
                            <tr>
                                <th>Pas de clients pour votre selection</th>
                            </tr>
                        )}
                        {!loading &&
                            invoices.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td>{invoice.chrono}</td>
                                    <td>
                                        {invoice.customer.firstName}{" "}
                                        {invoice.customer.lastName}
                                    </td>
                                    <td className="text-center">
                                        {formatDate(invoice.sentAt)}
                                    </td>
                                    <td className="text-center">
                                        <span
                                            className={
                                                "badge bg-" +
                                                STATUS_INFOS[invoice.status]
                                                    .CLASS
                                            }
                                        >
                                            {STATUS_INFOS[invoice.status].LABEL}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        {invoice.amount.toLocaleString()} €
                                    </td>
                                    <td>
                                        <button className="btn btn-primary me-1">
                                            Editer
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() =>
                                                handleDelete(invoice.id)
                                            }
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

export default InvoicesPageWithPagination;
