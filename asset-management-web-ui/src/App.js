import "./App.css";

import {BrowserRouter, Switch} from "react-router-dom";
import React, {useState} from "react";

import {LinearProgress} from "@material-ui/core";
import Login from './layout/header/Login';
import LoginFormPage from "./layout/header/LoginFormPage";
import Mainpage from "./components/Mainpage/Mainpage";
import {ToastContainer} from "react-toastify";

const App = () => {
    return (
       
        <BrowserRouter>
            <ToastContainer/>
            <Switch>
                {localStorage.getItem("username") === null ?
                    <Login/>
                    :
                     <Mainpage/>
                }
            </Switch>
        </BrowserRouter>
       
    );
};

export default App;