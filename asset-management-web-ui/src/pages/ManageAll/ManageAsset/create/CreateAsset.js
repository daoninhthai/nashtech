import React, {useEffect, useState} from 'react';
import {Form, FormControl, Button, FormCheck, Row} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Formik} from "formik";
import axios from "axios";
import {useHistory} from "react-router-dom";
import * as Yup from 'yup'
import {isValid} from 'date-fns';
import {TextField} from "@material-ui/core";

const CreateAsset = ({setResponseDataAsset, setChildPage}) => {
    const rootAPI = process.env.REACT_APP_SERVER_URL;
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        axios.get(rootAPI + "/categories").then((response) => {
            setCategories(response.data);
        });
    }, []);
    const history = useHistory();
    const initialValues = {
        assetName: null,
        specification: null,
        installedDate: null,
        state: null,
        category: null,
        status: false
    }
    const onSubmit = (values, {setSubmitting}) => {
        let create = {
            assetName: values.assetName,
            specification: values.specification,
            installedDate: values.installedDate,
            state: values.state,
            categoryDTO: {
                id: values.category
            },
        };
        axios.post(rootAPI + `/assets`, create)
            .then((response) => {
                setSubmitting(false);
                setResponseDataAsset({
                    id: response.data.id,
                    assetCode: response.data.assetCode,
                    assetName: response.data.assetName,
                    specification: response.data.specification,
                    installedDate: response.data.installedDate,
                    state: response.data.state,
                    categoryDTO: response.data.categoryDTO,
                });
                setChildPage(null);
                history.push("/asset");
            });
    };
    const ValidateSchema = Yup.object().shape({
        assetName: Yup.string()
            .min(2)
            .max(50)
            .required('Required')
            .typeError('Name can not empty'),
        category: Yup.string()
            .required('Required')
            .typeError('Category can not empty'),
        installedDate: Yup.string()
            .required('Required')
            .typeError('Installed date can not empty'),
        status: Yup.boolean()
            .required('Required')
            .typeError('State can not empty'),
    });
    const formValid = values => {
        return (values.assetName === null
            || values.category === null
            || values.installedDate === null
        )
    }

    function onKeyDown(keyEvent) {
        if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
            keyEvent.preventDefault();
        }
    }

    return (
        <div className={"container ps-5 d-block"}>
            <Row>
                <h1 className={"text-danger mb-5"}>Create New Asset</h1>
            </Row>
            <Row className={"mt-5"}>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
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
                                <p className={"w-25"}>Name</p>
                                <Form.Control
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    className={"w-75"}
                                    name={"assetName"}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.assetName && !errors.assetName}
                                    isInvalid={touched.assetName && errors.assetName}
                                />
                                {errors.assetName && touched.assetName ? (
                                    <div
                                        className={"text-danger"}
                                        style={{paddingLeft: "25%"}}
                                    >
                                        {errors.assetName}
                                    </div>
                                ) : null}
                            </Row>
                            <Row className="mb-3">
                                <p className={"col-3"}>Category</p>
                                <Form.Select
                                    name={"category"}
                                    size="sm"
                                    style={{width: '68%'}}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.category && !errors.category}
                                    isInvalid={touched.category && errors.category}
                                >
                                    <option selected/>
                                    {categories.map((category) => (
                                        <option value={category.id}>{category.name}</option>
                                    ))}
                                </Form.Select>
                                <Button style={{width:"7%"}}
                                        variant="outline-secondary"
                                        onClick={() => history.push('/createcategory')}
                                >
                                    <i className="bi bi-plus-lg"/>
                                </Button>
                                {errors.category && touched.category ? (
                                    <div
                                        className={"text-danger"}
                                        style={{paddingLeft: "25%"}}
                                    >
                                        {errors.category}
                                    </div>
                                ) : null}
                            </Row>
                            <Row className="mb-3">
                                <p className={"w-25"}>Specification</p>
                                <Form.Control
                                    name={"specification"}
                                    label={"Specification"}
                                    aria-describedby="basic-addon1"
                                    className={"w-75"}
                                    style={{height: "5em"}}
                                    onChange={handleChange}
                                />
                            </Row>
                            <Row className="mb-3">
                                <p className={"w-25"} id="basic-addon1">
                                    Installed Date
                                </p>
                                <FormControl
                                    type={"date"}
                                    aria-describedby="basic-addon1"
                                    className={"w-75"}
                                    name={"installedDate"}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.installedDate && !errors.installedDate}
                                    isInvalid={touched.installedDate && errors.installedDate}
                                />
                                {errors.installedDate && touched.installedDate ? (
                                    <div
                                        className={"text-danger"}
                                        style={{paddingLeft: "25%"}}
                                    >
                                        {errors.installedDate}
                                    </div>
                                ) : null}
                            </Row>
                            <Row>
                                <p id="basic-addon1" className={"w-25"}>
                                    State
                                </p>
                                <div
                                    className={"container-lg w-75"}
                                    style={{display: "flex", flexDirection: "column"}}
                                >
                                    <FormCheck
                                        inline
                                        name={"status"}
                                        type={"radio"}
                                        label={"Available"}
                                        className={"w-75"}
                                        onChange={() => (values.state = 0)}
                                    />
                                    <FormCheck
                                        inline
                                        name={"status"}
                                        type={"radio"}
                                        label={"Not available"}
                                        className={"w-75"}
                                        onChange={() => (values.state = 1)}
                                    />
                                    {errors.status && touched.status ? (
                                        <div className={"text-danger"}>{errors.status}</div>
                                    ) : null}
                                </div>
                            </Row>
                            <Row className={"justify-content-end"}>
                                <Button
                                    variant={"danger"}
                                    type={"submit"}
                                    style={{width:"100px"}}
                                    disabled={formValid(values)}
                                >
                                    SAVE
                                </Button>
                                <Button
                                    variant={"secondary"}
                                    onClick={() => {
                                        setChildPage(null);
                                        history.push("/asset")
                                    }}
                                    className={"ms-5"}
                                    style={{width:"100px"}}
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

export default CreateAsset;