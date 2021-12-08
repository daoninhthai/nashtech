import React from "react";
import {Form, FormControl, Button, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {Formik} from "formik";
import axios from "axios";
import {useHistory} from "react-router-dom";

const CreateCategory = () => {
    const rootAPI = process.env.REACT_APP_SERVER_URL;
    const history = useHistory();
    const initialValues = {
        name: null,
        prefix: null
    };
    const onSubmit = (values, {setSubmitting}) => {
        let create = {
            name: values.name,
            prefix: values.prefix
        };
        axios
            .post(rootAPI + `/categories`, create)
            .then((response) => {
                setSubmitting(false);
                history.push("/createasset");
            })
            .catch(error => {
                if (error.response.status === 400) {
                    console.log("ERROR!");
                }
            });
    };
    return (
        <div className={"container ps-5 d-block"}>
            <Row>
                <h1 className={"text-danger mb-5"}>Create New Category</h1>
            </Row>
            <Row className={"mt-5"}>
                <Formik initialValues={initialValues} onSubmit={onSubmit}>
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
                                    aria-label="Prefix"
                                    aria-describedby="basic-addon1"
                                    className={"w-75"}
                                    name={"name"}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onError={errors}
                                />
                            </Row>
                            <Row className="mb-3">
                                <p className={"w-25"}>Prefix</p>
                                <FormControl
                                    name={"prefix"}
                                    aria-label="Prefix"
                                    aria-describedby="basic-addon1"
                                    className={"w-75"}
                                    style={{height: "5em"}}
                                    onChange={handleChange}
                                />
                            </Row>
                            <Row className={"justify-content-end"}>
                                <Button
                                    variant={"danger"}
                                    type={"submit"}
                                    style={{width:"100px"}}
                                    on
                                >
                                    SAVE
                                </Button>
                                <Button
                                    variant={"secondary"}
                                    onClick={() => history.push("/createasset")}
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

export default CreateCategory;
