import "bootstrap/dist/css/bootstrap.min.css";

import * as Yup from "yup";

import {Button, Form, InputGroup, Row} from "react-bootstrap";
import React, {useState} from "react";

import {Formik} from "formik";
import Popup from "reactjs-popup";
import SearchAssetAntD from "./SearchAssetMTU";
// import SearchUser from "./SearchUser";
import SearchUserAntD from "./SearchUserAntD";
import SelectDate from "./SelectDate";
import axios from "axios";
import moment from "moment";
import {useHistory} from "react-router-dom";

const CreateAssignment = ({setResponseAssigment, setChildPage}) => {
    const rootAPI = process.env.REACT_APP_SERVER_URL;
    const history = useHistory();
    const initialValues = {
        assetDTO: {
            assetID: null,
        },
        userDTO: {
            assetCode: null,
            assetName: null,
        },
        assignedDate: moment().format("DD/MM/YYYY"),
        assignedBy: null,
        state: null,
        note: null,
    };

    const ValidateSchema = Yup.object().shape({
        note: Yup.string().nullable().max(255, "System only allows 255 characters"),
    });

    const onSubmit = (values, {setSubmitting}) => {
        let create = {
            assetDTO: {
                id: assetSelect.id,
            },
            userDTO: {
                id: singleUser.id,
            },
            assignedDate: moment(values.assignedDate, "DD-MM-YYYY").format(
                "YYYY-MM-DD"
            ),
            state: 5,
            note: values.note,
            assignedBy: localStorage.getItem("username"),
        };
        axios.post(rootAPI + `/assignments`, create).then((response) => {
            setSubmitting(false);
            setResponseAssigment({
                id: response.data.id,
                assetDTO: response.data.assetDTO,
                userDTO: response.data.userDTO,
                assignedDate: response.data.assignedDate,
                assignedBy: response.data.assignedBy,
                state: 5,
                note: response.data.note,
            });
            setChildPage(null);
            history.push("/assignment");
        });
    };
    const [singleUser, setSingleUser] = useState({
        id: null,
        username: null,
    });
    const [assetSelect, setAssetSelect] = useState({
        id: null,
        assetCode: null,
        assetName: null,
    });
    const myDate = moment().format("DD/MM/YYYY");
    const [selectDate, setSelectDate] = useState(myDate);
    const validate = (singleUser, assetSelect) => {
        const errors = {};

        if (!singleUser.username) {
            errors.username = "Require";
        }
        if (!assetSelect.assetCode) {
            errors.assetCode = "require";
        }

        return errors;
    };
    const formValid = () => {
        return !(singleUser.id === null || assetSelect.id === null);
    };
    return (
        <div className={"container ps-5 d-block"}>
            <Row>
                <h1 className={"text-danger mb-5"}>Create New Assignment</h1>
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
                          /* and other goodies */
                      }) => (
                        <Form onSubmit={handleSubmit} className={"col-7"}>
                            <Row className={"mb-3"}>
                                <InputGroup className={"pe-0"}>
                                    <p className={"w-25"}>User</p>
                                    <Form.Control
                                        readOnly
                                        className={"bg-white"}
                                        aria-label="Username"
                                        name={"userID"}
                                        value={singleUser.username}
                                        onBlur={handleBlur}
                                    />
                                    <Popup
                                        trigger={
                                            <InputGroup.Text className={"bg-white"}>
                                                <i className="bi bi-search"/>
                                            </InputGroup.Text>
                                        }
                                        position={"left top"}
                                        contentStyle={{width: "750px", borderRadius: "10px"}}
                                    >
                                        {(close) => (
                                            <SearchUserAntD
                                                close={close}
                                                setSingleUser={setSingleUser}
                                            />
                                        )}
                                    </Popup>
                                </InputGroup>
                            </Row>
                            <Row className="mb-3">
                                <InputGroup className={"pe-0"}>
                                    <p className={"w-25"}>Asset</p>
                                    <Form.Control
                                        readOnly
                                        className={"bg-white"}
                                        aria-label="Username"
                                        name={"assetID"}
                                        value={assetSelect.assetCode}
                                        onBlur={handleBlur}
                                    />
                                    <Popup
                                        trigger={
                                            <InputGroup.Text className={"bg-white"}>
                                                <i className="bi bi-search"/>
                                            </InputGroup.Text>
                                        }
                                        position={"left top"}
                                        contentStyle={{width: "750px", borderRadius: "10px"}}
                                    >
                                        {(close) => (
                                            <SearchAssetAntD
                                                close={close}
                                                setAssetSelect={setAssetSelect}
                                            />
                                        )}
                                    </Popup>
                                </InputGroup>
                            </Row>
                            <Row className="mb-3">
                                <InputGroup className={"pe-0"}>
                                    <p className={"w-25"} id="basic-addon1">
                                        Assigned Date
                                    </p>
                                    <Form.Control
                                        // readOnly
                                        aria-describedby="basic-addon1"
                                        className={"bg-white"}
                                        name={"assignedDate"}
                                        value={values.assignedDate}
                                        onChange={handleChange}
                                    />
                                    <Popup
                                        trigger={
                                            <InputGroup.Text className={"bg-white"}>
                                                <i className="bi bi-calendar-event-fill"/>
                                            </InputGroup.Text>
                                        }
                                        position={"left top"}
                                        contentStyle={{width: "auto", padding: "0"}}
                                    >
                                        {(close) => (
                                            <SelectDate
                                                setSelectDate={setSelectDate}
                                                values={values}
                                            />
                                        )}
                                    </Popup>
                                </InputGroup>
                            </Row>
                            <Row className="mb-3">
                                <InputGroup className={"pe-0"}>
                                    <p className={"w-25"}>Note</p>
                                    <Form.Control
                                        name={"note"}
                                        aria-describedby="basic-addon1"
                                        className={"w-75"}
                                        style={{height: "5em"}}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.note && !errors.note}
                                        isInvalid={touched.note && errors.note}
                                    />
                                </InputGroup>
                                {errors.note && touched.note ? (
                                    <div className={"text-danger"} style={{paddingLeft: "25%"}}>
                                        {errors.note}
                                    </div>
                                ) : null}
                            </Row>
                            <Row className={"justify-content-end"}>
                                <Button
                                    variant={"danger"}
                                    type={"submit"}
                                    style={{width: "100px"}}
                                    disabled={!formValid()}
                                >
                                    SAVE
                                </Button>
                                <Button
                                    variant={"secondary"}
                                    onClick={() => {
                                        setChildPage(null);
                                        history.push("/assignment")
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

export default CreateAssignment;
