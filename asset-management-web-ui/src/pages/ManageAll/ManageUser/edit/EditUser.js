import 'bootstrap/dist/css/bootstrap.min.css';

import * as Yup from "yup";

import {Button, Form, FormCheck, FormControl, Row} from "react-bootstrap";
import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import '../../../../style/style.css'
import {Formik} from 'formik';
import axios from "axios";
import differenceInDays from 'date-fns/differenceInDays/index.js';
import {differenceInYears} from "date-fns";

const EditUser = ({setResponseUser, setChildPage}) => {

    const token = localStorage.getItem('jwttoken')

    const headers = {
        'Authorization': token

    };
    const rootAPI = process.env.REACT_APP_SERVER_URL;
    let {id} = useParams();
    const history = useHistory();
    const [user, setUser] = useState({
        id: null,
        username: null,
        staffCode: null,
        firstName: null,
        lastName: null,
        dob: null,
        gender: null,
        joinedDate: null,
        authority: null,
        password: null,
        location: null,
        status: null
    });
    useEffect(() => {
        axios
            .get(rootAPI + `/users/${id}`, {headers})
            .then(function (response) {
                setUser(response.data);
                setGender(response.data.gender);
            });
    }, [id])

    const [gender, setGender] = useState("");
    const initialValues = {
        staffCode: user.staffCode,
        firstName: user.firstName,
        username: user.username,
        lastName: user.lastName,
        dob: user.dob,
        gender: user.gender,
        joinedDate: user.joinedDate,
        authority: user.authority,
        status: user.status,
        location: user.location,
        password: user.password

    }
    const onSubmit = (values, {setSubmitting}) => {
        let editUser = {
            staff_code: values.staffCode,
            username: values.username,
            first_name: values.firstName,
            last_name: values.lastName,
            dob: values.dob,
            gender: gender,
            joined_date: values.joinedDate,
            authority: values.authority,
            status: user.status,
            location: user.location,
            password: user.password
        }
        axios
            .put(rootAPI + `/users/${id}`, editUser, {headers})
            .then((response) => {
                setSubmitting(false);
                setResponseUser({
                    id: response.data.id,
                    staffCode: response.data.staffCode,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    username: response.data.username,
                    dob: response.data.dob,
                    gender: response.data.gender,
                    joinedDate: response.data.joinedDate,
                    authority: response.data.authority
                });
                setChildPage(null);
                history.push("/user");
            });
    };
    const ValidateSchema = Yup.object().shape({
        firstName: Yup.string()
            .max(255)
            .required("Required")
            .typeError("First name is required"),
        lastName: Yup.string()
            .max(255)
            .required("Required")
            .typeError("Last name is required"),
        authority: Yup.string()
            .required("Required")
            .typeError("Please select type"),
        dob: Yup.date()
            .required()
            .typeError("DOB is required")
            .test(
                "dob",
                "User is under 18. Please select a different date",
                function (value) {
                    return differenceInYears(new Date(), new Date(value)) >= 18;
                }
            ),
        joinedDate: Yup.date()
            .required()
            .typeError("Joined Date is required")
            .min(
                Yup.ref("dob"),
                "Joined date is not later than Date of Birth. Please select a different date"
            )
            .test(
                "dob",
                "Joined date is not later than Date of Birth. Please select a different date",
                function (value) {
                    return (
                        differenceInDays(new Date(value), new Date(this.parent.dob)) != 0
                    );
                }
            )
            .test(
                "dob",
                "Joined date is Saturday or Sunday. Please select a different date",
                function (value) {
                    const currentDate = new Date(value);
                    return currentDate.getDay() !== 6 && currentDate.getDay() !== 0;
                }
            ),
    });

    function onKeyDown(keyEvent) {
        if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
            keyEvent.preventDefault();
        }
    }

    return (
        <div className={"container ps-5 d-block"}>
            <Row>
                <h1 className={"text-danger mb-5"}>Edit User</h1>
            </Row>
            <Row className={"mt-5 justify-content-start"}>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    enableReinitialize={"true"}
                    validationSchema={ValidateSchema}
                >
                    {({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          isSubmitting,
                          /* and other goodies */
                      }) => (
                        <Form onSubmit={handleSubmit}
                              onKeyDown={onKeyDown}
                              className={"col-7"}
                        >
                            <Row className={"mb-3"}>
                                <p className={"w-25"}>First Name</p>
                                <FormControl
                                    readOnly
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    className={"w-75"}
                                    name="firstName"
                                    style={{backgroundColor: "#eff1f5"}}
                                    value={values.firstName}
                                    onChange={handleChange}
                                    onError={errors}
                                    onBlur={handleBlur}
                                    isValid={touched.firstName && !errors.firstName}
                                    isInvalid={touched.firstName && errors.firstName}
                                />
                                {errors.firstName && touched.firstName ? (
                                    <div
                                        className={"text-danger"}
                                        style={{paddingLeft: "25%"}}
                                    >
                                        {errors.firstName}
                                    </div>
                                ) : null}
                            </Row>
                            <Row className={"mb-3"}>
                                <p className={"w-25"}>Last Name</p>
                                <FormControl
                                    readOnly
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    className={"w-75 "}
                                    name="lastName"
                                    style={{backgroundColor: "#eff1f5"}}
                                    value={values.lastName}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    isValid={touched.lastName && !errors.lastName}
                                    isInvalid={touched.lastName && errors.lastName}
                                />
                                {errors.lastName && touched.lastName ? (
                                    <div
                                        className={"text-danger"}
                                        style={{paddingLeft: "25%"}}
                                    >
                                        {errors.lastName}
                                    </div>
                                ) : null}
                            </Row>
                            <Row className="mb-3">
                                <p className={"w-25"} id="basic-addon1">
                                    Date of Birth
                                </p>
                                <FormControl
                                    type={"date"}
                                    aria-describedby="basic-addon1"
                                    name={"dob"}
                                    className={"w-75"}
                                    onBlur={handleBlur}
                                    value={values.dob}
                                    onChange={handleChange}
                                    isValid={touched.dob && !errors.dob}
                                    isInvalid={touched.dob && errors.dob}
                                />
                                {errors.dob && touched.dob ? (
                                    <div
                                        className={"text-danger"}
                                        style={{paddingLeft: "25%"}}
                                    >
                                        {errors.dob}
                                    </div>
                                ) : null}
                            </Row>
                            <Row className={"mb-3"}>
                                <p id="basic-addon1" className={"w-25"}>
                                    Gender
                                </p>
                                <div className={"container-lg w-75 d-flex"}>
                                    <FormCheck
                                        inline
                                        type={"radio"}
                                        label={"Female"}
                                        className={"w-75"}
                                        name={"gender"}
                                        checked={gender === "Female"}
                                        onChange={() => setGender("Female")}
                                    />
                                    <FormCheck
                                        inline
                                        type={"radio"}
                                        label={"Male"}
                                        className={"w-75"}
                                        name={"gender"}
                                        checked={gender === "Male"}
                                        onChange={() => setGender("Male")}
                                    />
                                </div>
                            </Row>
                            <Row className="mb-3">
                                <p className={"w-25"} id="basic-addon1">
                                    Joined Date
                                </p>
                                <FormControl
                                    type={"date"}
                                    aria-describedby="basic-addon1"
                                    className={"w-75"}
                                    name={"joinedDate"}
                                    value={values.joinedDate}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.joinedDate && !errors.joinedDate}
                                    isInvalid={touched.joinedDate && errors.joinedDate}
                                />
                                {errors.joinedDate && touched.joinedDate ? (
                                    <div
                                        className={"text-danger"}
                                        style={{paddingLeft: "25%"}}
                                    >
                                        {errors.joinedDate}
                                    </div>
                                ) : null}
                            </Row>
                            <Row className="mb-3">
                                <p className={"col-3"}>Type</p>
                                <Form.Select
                                    size="sm"
                                    className={"w-75"}
                                    name={"authority"}
                                    value={values.authority}
                                    onChange={handleChange}
                                    isValid={touched.authority && !errors.authority}
                                    isInvalid={touched.authority && errors.authority}
                                >
                                    <option selected></option>
                                    <option value={"ADMIN"}>Admin</option>
                                    <option value={"STAFF"}>Staff</option>
                                </Form.Select>
                                {errors.authority && touched.authority ? (
                                    <div
                                        className={"text-danger"}
                                        style={{paddingLeft: "25%"}}
                                    >
                                        {errors.authority}
                                    </div>
                                ) : null}
                            </Row>
                            <Row className={"justify-content-end"}>
                                <Button
                                    variant={"danger"}
                                    type="submit"
                                    style={{width: "100px"}}
                                >
                                    SAVE
                                </Button>
                                <Button
                                    variant={"secondary"}
                                    type={"submit"}
                                    className={"ms-5"}
                                    style={{width: "100px"}}
                                    onClick={() => {
                                        setChildPage(null);
                                        history.push("/user")
                                    }}
                                >
                                    CANCEL
                                </Button>

                            </Row>
                        </Form>
                    )}
                </Formik>
            </Row>
        </div>
    );
};

export default EditUser;