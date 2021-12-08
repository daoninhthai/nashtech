import 'bootstrap/dist/css/bootstrap.min.css';
import './UserInfo.css'

import * as Yup from "yup";
import {Button, Form, FormControl, InputGroup, Row} from "react-bootstrap";
import {useState} from "react";
import {useHistory} from 'react-router-dom';
import {ButtonGroup} from "react-bootstrap";
import {Formik} from 'formik';
import React from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

const UserInfo = ({props, loginSuccess, setResponseUser}) => {
    const username = localStorage.getItem('username')
    const token = localStorage.getItem('jwttoken')
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    const headers = {
        'Authorization': token

    };
    const [showLoginSuccess, setShowLoginSuccess] = useState(false);
    const rootAPI = process.env.REACT_APP_SERVER_URL;
    const [submitError, setSubmitError] = useState("");
    const history = useHistory();


    const initialValues = {oldPassword: '', newPassword: ''};

    const ValidateSchema = Yup.object().shape({
        oldPassword: Yup.string()
            .max(500)
            .required('Required')
            .typeError('Current Password is required'),
        newPassword: Yup.string()
            .min(8, "Password at least have 8 character")
            .max(500)
            .matches(/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password requires at least 8 characters, one number, one special character (e.g.!@#$%)")
            .required('Required')
            .typeError('New Password is required'),
    });
    const onSubmit = (values, {setSubmitting}) => {
        axios({
                method: "POST",
                url: rootAPI + "/authenticate",
                data: {
                    username: username,
                    password: values.oldPassword,
                },
            }
        )
            .then((response) => {
                setSubmitting(false);
                localStorage.setItem("jwttoken", "Bearer " + response.data.jwttoken);
                setShowLoginSuccess(true);
                toast.success("Your password has been changed successfully");
            }).then((response) => {
            let editUserPassword = {
                password: values.newPassword
            }
            axios
                .put(rootAPI + `/change-password/${username}`, editUserPassword, {headers})
                .then((response) => {
                    setSubmitting(false);

                }).catch((error) => {
                localStorage.clear()
                window.location.href = "/login";
            });
        })

            .catch((error) => {
                setSubmitting(false);
                setSubmitError(
                    "Login fails status code: " + error
                );
                toast.error("Password is incorrect");

            });
    }


    return (
        <div className="body-changepassword">
            <h3 className={"text-danger"}>Change Password</h3>
            <hr className={"w-75"}/>
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
                    <Form onSubmit={handleSubmit} className={"w-75"}>
                        <InputGroup className={"pe-0 mb-3"}>
                            <p className={"w-25 m-0"} style={{paddingTop: "1%"}}>Old Password</p>
                            <Form.Control
                                aria-label="Old Password"
                                value={values.oldPassword}
                                name={"oldPassword"}
                                type={showPassword ? "text" : "password"}
                                className={"border-end-light rounded-start"}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.oldPassword && errors.oldPassword}
                            />
                            <InputGroup.Text variant={"outline-secondary"}
                                             className={"border-start-0 bg-white"}
                            >
                                {showPassword ? <VisibilityIcon onClick={togglePasswordVisibility}/>
                                    : <VisibilityOffIcon onClick={togglePasswordVisibility}/>}
                            </InputGroup.Text>
                        </InputGroup>
                        {errors.oldPassword && touched.oldPassword ? (
                            <div className={"text-danger mb-3"} style={{paddingLeft: "18%"}}>{errors.oldPassword}</div>
                        ) : null}
                        <InputGroup className={"pe-0 mb-3"}>
                            <p className={"w-25 m-0"} style={{paddingTop: "1%"}}>New Password</p>
                            <Form.Control
                                aria-label="New Password"
                                aria-describedby="basic-addon1"
                                className={"border-end-light rounded-start"}
                                value={values.newPassword}
                                name={"newPassword"}
                                type={showPassword ? "text" : "password"}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={touched.newPassword && errors.newPassword}
                            />
                            <InputGroup.Text variant={"outline-secondary"}
                                             className={"border-start-0 bg-white"}
                            >
                                {showPassword ? <VisibilityIcon onClick={togglePasswordVisibility}/>
                                    : <VisibilityOffIcon onClick={togglePasswordVisibility}/>}
                            </InputGroup.Text>
                        </InputGroup>
                        {errors.newPassword && touched.newPassword ? (
                            <div className={"text-danger mb-3"} style={{paddingLeft: "18%"}}>{errors.newPassword}</div>
                        ) : null}
                        <Row className={"justify-content-end"} style={{paddingRight:"12px"}}>
                            <Button variant={"danger"}
                                    type={"submit"}
                                    disabled={isSubmitting}
                                    style={{width:"100px"}}
                                    className={"me-5"}
                            >
                                SAVE
                            </Button>
                            <Button variant={"secondary"}
                                    style={{width:"100px"}}
                                    onClick={() => history.push('/home')} type={"submit"}>
                                CANCEL
                            </Button>
                        </Row>

                    </Form>

                )
                }
            </Formik>
        </div>


    );
}

export default UserInfo;
