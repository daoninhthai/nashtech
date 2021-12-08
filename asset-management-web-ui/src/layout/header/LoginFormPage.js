import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './LoginFormPage.css'

import * as Yup from "yup";

import {Button, Form, FormControl, Row} from "react-bootstrap";
import {Formik, useFormik} from 'formik';

import React from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
import {useHistory} from 'react-router-dom';
import {useState} from "react";

const LoginFormPage = ({props, loginSuccess}) => {
    const rootAPI = process.env.REACT_APP_SERVER_URL;
    const [showLoginSuccess, setShowLoginSuccess] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const history = useHistory();
    const  initialValues = {username: '', password: ''};
    const ValidateSchema = Yup.object().shape({
        username: Yup.string()
            .max(50)
            .required('Required')
            .typeError('Username is required'),
        password: Yup.string()
            .max(500)
            .required('Required')
            .typeError('Password is required'),
    });
    const onSubmit = (values, {setSubmitting}) => {
        axios({
                method: "POST",
                url: rootAPI+"/authenticate",
                data: {
                    username: values.username,
                    password: values.password,
                },
            }
        )
            .then((response) => {
                setSubmitting(false);
                localStorage.clear();
                setShowLoginSuccess(true);
                localStorage.setItem("jwttoken", "Bearer " + response.data.jwttoken);
                localStorage.setItem("username", values.username);
                localStorage.setItem("password", values.password);
                 window.location.href = "/home";
                toast.success("Logging success");
            }).catch((error) => {
            setSubmitting(false);
            setSubmitError(
                "Login fails status code: " + error
            );
             toast.error("Username or password is incorrect. Please try again");
        });
    }

    return (
        <div className={"container login-form-body  ps-5 d-block"}>
            <Row>
                <h1 className={"text-danger mb-5"}>Login</h1>
            </Row>
            <Row className={"mt-5"}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={ValidateSchema}
                    onSubmit={onSubmit}
                >
                    {({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          isSubmitting,
                      }) => (
                        <Form onSubmit={handleSubmit}>
                            <Row className={"mb-3"}>
                                <p className={"w-25"}>Username</p>
                                <FormControl
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    value={values.username}
                                    className={"w-75"}
                                    name={"username"}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    isInvalid={touched.username && errors.username}
                                />
                                {errors.username && touched.username ? (
                                    <div className={"text-danger"} style={{paddingLeft: "25%"}}>{errors.username}</div>
                                ) : null}
                            </Row>
                            <Row className={"mb-3"}>
                                <p className={"w-25"}>Password</p>
                                <FormControl
                                    aria-label="Password"
                                    aria-describedby="basic-addon1"
                                    value={values.password}
                                    className={"w-75"}
                                    name={"password"}
                                    type={"password"}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    isInvalid={touched.password && errors.password}
                                />
                                {errors.password && touched.password ? (
                                    <div className={"text-danger"} style={{paddingLeft: "25%"}}>{errors.password}</div>
                                ) : null}
                            </Row>

                            {/* <Button variant={"danger"} onClick={() => history.push('/')} type={"submit"}
                                    className={"ms-5"} style={{float: 'right'}}>
                                Cancel
                            </Button> */}

                            <Button variant={"danger"} type={"submit"} style={{float: 'right'}} disabled={!values.username || !values.password}
                                    on>
                                Sign In
                            </Button>

                        </Form>

                    )
                    }
                </Formik>

            </Row>
        </div>
    );
}

export default LoginFormPage;
