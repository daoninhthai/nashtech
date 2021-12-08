import './index.css';

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from "axios";
import reportWebVitals from './reportWebVitals';
import {toast} from "react-toastify";

const token = localStorage.getItem("jwttoken");
axios.defaults.headers.common["Authorization"] = token;
axios.defaults.headers.post["Content-Type"] = "application/json";


axios.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error.response);
        if (error?.response?.status === 401) {
            if (error.response.data !== "Account Disabled" && error.response.data !== "Bad Credentials") {
                localStorage.removeItem("username");
                localStorage.removeItem("password");
                localStorage.removeItem("jwttoken");
                alert("Session timed out! Please log in to continue");
                window.location.href = "/";
            }
            else {
                return Promise.reject(error);
            }
        } else {
            return Promise.reject(error);
        }
    }
);


ReactDOM.render(
   <App/>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
