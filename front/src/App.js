// @ts-nocheck
import React from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomersPageWithPagination from "./pages/CustomersPageWithPagination";
import InvociesPageWithPagination from "./pages/InvociesPageWithPagination";

class App extends React.Component {
    componentWillMount() {
        let myInit = {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                username: "margaret.martinez@bouygtel.fr",
                password: "password",
            }),
        };

        fetch("http://192.168.88.188/api/login_check", myInit)
            .then(function (response) {
                return response.json();
            })
            .then(function (myBlob) {
                console.log(myBlob);
            });
    }

    render() {
        return (
            <BrowserRouter>
                <Navbar />
                <main className="container">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route
                            path="/customers"
                            element={<CustomersPageWithPagination />}
                        />
                        <Route
                            path="/invoices"
                            element={<InvociesPageWithPagination />}
                        />
                    </Routes>
                </main>
            </BrowserRouter>
        );
    }
}

export default App;
