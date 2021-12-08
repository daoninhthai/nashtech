import React, {useEffect, useState} from 'react';
import {Form, FormControl, Button, FormCheck, Row} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from "axios";
import {Formik} from 'formik';
import {useHistory, useParams} from 'react-router-dom';
import * as Yup from "yup";


const EditAsset = ({setResponseDataAsset, setChildPage}) => {
    const rootAPI = process.env.REACT_APP_SERVER_URL;
    let {id} = useParams();
    const history = useHistory();
    const [asset, setAsset] = useState({
        assetName: null,
        specification: null,
        installedDate: null,
        state: null,
        categoryDTO: {
            name: null
        }
    });
    useEffect(() => {
        axios
            .get(rootAPI + `/assets/${id}`)
            .then(function (response) {
                setAsset(response.data);
                setState(response.data.state);
            });
    }, [id])
    const [state, setState] = useState("");
    const initialValues = {
        assetName: asset.assetName,
        specification: asset.specification,
        installedDate: asset.installedDate,
        state: asset.state,
        categoryDTO: {
            name: asset.categoryDTO.name
        }
    }
    const onSubmit = (values, {setSubmitting}) => {
        let edit = {
            id: id,
            assetName: values.assetName,
            specification: values.specification,
            installedDate: values.installedDate,
            state: state
        }
        axios
            .put(rootAPI + `/assets/${id}`, edit)
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
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        axios.get(rootAPI + "/categories").then((response) => {
            setCategories(response.data);
        }, []);
    }, []);
    const ValidateSchema = Yup.object().shape({
        assetName: Yup.string()
            .min(2)
            .max(50)
            .required('Required')
            .typeError('Name can not empty'),
        installedDate: Yup.string()
            .required('Required')
            .typeError('Installed date can not empty'),
    });
    return (
        <div className={"container ps-5 d-block"}>
            <Row>
                <h1 className={"text-danger mb-5"}>Edit Asset</h1>
            </Row>
            <Row className={"mt-5"}>
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
                        <Form onSubmit={handleSubmit} className={"col-7"}>
                            <Row className={"mb-3"}>
                                <p className={"w-25"}>Name</p>
                                <FormControl
                                    name={"assetName"}
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    className={"w-75"}
                                    value={values.assetName}
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
                                <Form.Control
                                    size="sm"
                                    className={"w-75"}
                                    name={"category"}
                                    value={values.categoryDTO.name}
                                    disabled
                                />
                            </Row>
                            <Row className="mb-3">
                                <p className={"w-25"}>Specification</p>
                                <FormControl
                                    aria-label="Specification"
                                    aria-describedby="basic-addon1"
                                    className={"w-75"}
                                    style={{height: "5em"}}
                                    name={"specification"}
                                    value={values.specification}
                                    onChange={handleChange}
                                />
                            </Row>
                            <Row className="mb-3">
                                <p className={"w-25"} id="basic-addon1">
                                    Installed Date
                                </p>
                                <FormControl
                                    name={"installedDate"}
                                    type={"date"}
                                    aria-describedby="basic-addon1"
                                    className={"w-75"}
                                    value={values.installedDate}
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
                                        type={"radio"}
                                        label={"Available"}
                                        className={"w-75"}
                                        name={"status"}
                                        checked={state === 0}
                                        onChange={() => setState(0)}
                                    />
                                    <FormCheck
                                        inline
                                        type={"radio"}
                                        label={"Not available"}
                                        className={"w-75"}
                                        name={"status"}
                                        checked={state === 1}
                                        onChange={() => setState(1)}
                                    />
                                    <FormCheck
                                        inline
                                        type={"radio"}
                                        label={"Waiting for recycling"}
                                        className={"w-75"}
                                        name={"status"}
                                        checked={state === 2}
                                        onChange={() => setState(2)}
                                    />
                                    <FormCheck
                                        inline
                                        type={"radio"}
                                        label={"Recycled"}
                                        className={"w-75"}
                                        name={"status"}
                                        checked={state === 3}
                                        onChange={() => setState(3)}
                                    />
                                </div>
                            </Row>
                            <Row className={"justify-content-end"}>
                                <Button
                                    variant={"danger"}
                                    type={"submit"}
                                    style={{width: "100px"}}
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
                                    style={{width: "100px"}}
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

export default EditAsset;