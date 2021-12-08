import React, {useState, useEffect} from "react";
import {
    Form,
    FormControl,
    Button,
    FormCheck,
    Row,
    InputGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {Formik} from "formik";
import axios from "axios";
import {useHistory, useParams} from "react-router-dom";

import Popup from "reactjs-popup";
import SearchAssetAntD from "../create/SearchAssetMTU";
import SearchUserAntD from "../create/SearchUserAntD";

const EditAssignment = ({setResponseAssigment, setChildPage}) => {
    const rootAPI = process.env.REACT_APP_SERVER_URL;
    let {id} = useParams();
    const history = useHistory();
    const [asset, setAsset] = useState({
        assetDTO: {
            assetID: null,
        },
        userDTO: {
            userID: null,
        },
        assignedDate: null,
        assignedBy: null,
        state: null,
        note: null,
    });
    const [singleUser, setSingleUser] = useState({
        id: null,
        username: null,
    });
    const [assetSelect, setAssetSelect] = useState({
        id: null,
        assetName: null,
        assetCode: null,
    });
    useEffect(() => {
        axios.get(rootAPI + `/assignments/${id}`).then(function (response) {
            setAsset(response.data);
            setSingleUser(response.data.userDTO);
            setAssetSelect(response.data.assetDTO);
        });
    }, [id]);
    const initialValues = {
        id: id,
        assetDTO: {
            id: assetSelect.id,
            assetName: assetSelect.assetName,
            assetCode: assetSelect.assetCode,
        },
        userDTO: {
            id: singleUser.id,
            username: singleUser.username,
        },
        assignedDate: asset.assignedDate,
        assignedBy: localStorage.getItem("username"),
        state: asset.state,
        note: asset.note,
    };
    const onSubmit = (values, {setSubmitting}) => {
        let edit = {
            id: id,
            assetDTO: values.assetDTO,
            userDTO: values.userDTO,
            assignedDate: values.assignedDate,
            assignedBy: values.assignedBy,
            state: values.state,
            note: values.note,
        };
        axios.put(rootAPI + `/assignments/${id}`, edit).then((response) => {
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

    return (
        <div className={"container ps-5 d-block"}>
            <Row>
                <h1 className={"text-danger mb-5"}>Edit Assignment</h1>
            </Row>
            <Row className={"mt-5"}>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    enableReinitialize={"true"}
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
                        <Form onSubmit={handleSubmit} className={"col-7"}>
                            <InputGroup className={"pe-0 mb-3"}>
                                <p className={"w-25"}>User</p>
                                <Form.Control
                                    disabled
                                    className={"bg-white rounded-start"}
                                    aria-label="Username"
                                    name={"userID"}
                                    value={values.userDTO.username}
                                    onBlur={handleBlur}
                                />
                                <Popup
                                    trigger={
                                        <InputGroup.Text className={"bg-white"}>
                                            <i className="bi bi-search"/>
                                        </InputGroup.Text>
                                    }
                                    position={"left top"}
                                    contentStyle={{width: "750px"}}
                                    modal
                                >
                                    {(close) => (
                                        <SearchUserAntD
                                            close={close}
                                            setSingleUser={setSingleUser}
                                        />
                                    )}
                                </Popup>
                            </InputGroup>

                            <InputGroup className={"pe-0 mb-3"}>
                                <p className={"w-25"}>Asset</p>
                                <Form.Control
                                    disabled
                                    className={"bg-white rounded-start"}
                                    aria-label="Assetname"
                                    name={"assetID"}
                                    value={values.assetDTO.assetName}
                                    onBlur={handleBlur}
                                />
                                <Popup
                                    trigger={
                                        <InputGroup.Text className={"bg-white"}>
                                            <i className="bi bi-search"/>
                                        </InputGroup.Text>
                                    }
                                    position={"left top"}
                                    contentStyle={{width: "750px"}}
                                    modal
                                >
                                    {(close) => (
                                        <SearchAssetAntD
                                            close={close}
                                            setAssetSelect={setAssetSelect}
                                        />
                                    )}
                                </Popup>
                            </InputGroup>

                            <InputGroup className={" pe-0 mb-3"}>
                                <p className={"w-25"}>
                                    Assigned Date
                                </p>
                                <Form.Control
                                    type={"date"}
                                    className={"w-75 rounded-start"}
                                    name={"assignedDate"}
                                    onChange={handleChange}
                                    value={values.assignedDate}
                                    onBlur={handleBlur}
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <p className={"w-25"}>Note</p>
                                <FormControl
                                    name={"note"}
                                    className={"w-75 rounded-start"}
                                    value={values.note}
                                    onBlur={handleBlur}
                                    style={{height: "5em"}}
                                    onChange={handleChange}
                                />
                            </InputGroup>
                            <Row className={"justify-content-end"} style={{paddingRight:"12px"}}>
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
export default EditAssignment;
