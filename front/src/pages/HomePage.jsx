import React from "react";

export const HomePage = (props) => {
    return (
        <div className="row">
            <div className="list-group-item flex-column align-items-start mt-5 col-5">
                <div className="d-flex w-100 justify-content-between">
                    <h3 className="mb-3">List group item heading</h3>
                </div>
                <p className="mb-3">
                    Donec id elit non mi porta gravida at eget metus. Maecenas sed
                    diam eget risus varius blandit.
                </p>
                <small className="text-muted">Donec id elit non mi porta.</small>
            </div>
        </div>
    );
};

export default HomePage;
