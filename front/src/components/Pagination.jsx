import React from "react";
import _ from "lodash";

const Pagination = ({ currentPage, itemsPerPage, length, onPageChanged }) => {
    const pageCount = Math.ceil(length / itemsPerPage);
    const pages = _.range(1, pageCount + 1);

    return (
        <div>
            <ul className="pagination pagination-sm">
                <li
                    className={
                        "page-item " + (currentPage === 1 ? "disabled" : "")
                    }
                >
                    <button
                        className="page-link"
                        onClick={() => onPageChanged(currentPage - 1)}
                    >
                        &laquo;
                    </button>
                </li>
                {pages.map((page) => (
                    <li
                        className={
                            "page-item" +
                            (currentPage === page ? " active" : "")
                        }
                        key={page}
                    >
                        <button
                            className="page-link"
                            onClick={() => onPageChanged(page)}
                        >
                            {page}
                        </button>
                    </li>
                ))}
                <li
                    className={
                        "page-item " +
                        (currentPage === pageCount ? "disabled" : "")
                    }
                >
                    <button
                        className="page-link"
                        onClick={() => onPageChanged(currentPage + 1)}
                    >
                        &raquo;
                    </button>
                </li>
            </ul>
        </div>
    );
};

Pagination.getData = (items, currentPage, itemsPerPage) => {
    const start = currentPage * itemsPerPage - itemsPerPage;
    return items.slice(start, start + itemsPerPage);
};

export default Pagination;
