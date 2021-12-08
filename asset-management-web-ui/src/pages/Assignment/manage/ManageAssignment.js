import "bootstrap/dist/css/bootstrap.min.css";
import "reactjs-popup/dist/index.css";
import '../../../style/style.css'
import {
    Button,
    Container,
    Form,
    FormControl,
    InputGroup,
    Row,
    Table,
} from "react-bootstrap";
import React, {useEffect, useMemo, useRef, useState} from "react";
import DeleteAssignment from "../delete/DeleteAssignment";
import Pagination from "../../../components/Pagination/Pagination";
import Popup from "reactjs-popup";
import ViewDetailAssignment from "../viewDetails/ViewDetailAssignment";
import axios from "axios";
import {useHistory} from "react-router-dom";
import dateFormat from 'dateformat';
import ReturnPopup from "../../home/popup/ReturnPopup";

const ManageAssignment = ({responseAssigment, setChildPage, setCurrentPages, setResponseAssignment}) => {
    const rootAPI = process.env.REACT_APP_SERVER_URL;
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState(null);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const [list, setList] = useState([]);
    const history = useHistory();
    const [state, setState] = useState({
        state: null
    });
    const [refreshList, setRefreshList] = useState(false);
    const [type, setType] = useState();
    const [date, setDate] = useState();
    const [keyword, setKeyword] = useState();
    const request = {
        params: {
            type,
            date,
            keyword
        },
    };
    const handleFilterType = (evt) => {
        setType(evt.target.value);
    };
    const handleFilterAssignedDate = (evt) => {
        setDate(evt.target.value);
    };
    const handleFilterSearch = (evt) => {
        setKeyword(evt.target.value);
    };
    //prevent filter api autorun with useRef()
    const isFirstRun = useRef(true);
    let config = {
        headers: {
            'Authorization': localStorage.getItem("jwttoken"),
        },
        params: request.params
    }
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        if (request.params.type === "State") {
            request.params.type = null;
        }
        if (request.params.date === "Assigned Date") {
            request.params.date = null;
        }
        if (request.params.keyword === "") {
            request.params.keyword = null;
        }
        axios
            .get(rootAPI + `/assignments`, config)
            .then(function (response) {
                setCurrentPage(1)
                setList(response.data);
            });
        console.log("useEffect type date keyword")
    }, [type, date, keyword]);


    useEffect(() => {
        axios.get(rootAPI + "/assignments", config).then(function (response) {
            let result = response.data.map((assigment) => assigment.id);
            if (responseAssigment && result.includes(responseAssigment.id)) {
                const index = result.indexOf(responseAssigment.id);
                const newAssignment = response.data.splice(index, 1)[0];
                response.data.unshift(newAssignment);
                setList(response.data);
                setResponseAssignment(null);
            } else {
                setList(response.data);
            }
            setCurrentPages("Manage Assignment")
            setRefreshList(false);
            setDisable(false);
            console.log("useEffect state refreshList")
        });
    }, [state, refreshList]);
    list.map(assignment => {
        if(assignment.state === 5) {
            assignment.state = "Waiting for acceptance";
        }if(assignment.state === 6) {
            assignment.state = "Accepted";
        }if(assignment.state === 7) {
            assignment.state = "Decline";
        }if(assignment.state === 8) {
            assignment.state = "Waiting for returning";
        }
    });
    console.log(list)
    const checkButton = (state, assigment) => {
        if (state === "Waiting for acceptance") {
            return (
                <>
                    <td>
                        <i className="bi bi-pen btn m-0 text-muted p-0 zoomin"
                           onClick={() => {
                               setChildPage("Edit Assignment");
                               history.push(`/editassignment/${assigment.id}`);
                           }
                           }
                        />
                    </td>
                    <Popup
                        contentStyle={{
                            width: "25%",
                            border: "1px solid black",
                            borderRadius: 10,
                            overflow: "hidden",
                        }}
                        trigger={
                            <td>
                                <i className="bi bi-x-circle text-danger btn p-0 zoomin"/>
                            </td>
                        }
                        modal
                        closeOnDocumentClick={false}
                    >
                        {close => <DeleteAssignment setDisable={setDisable}
                                                    id={assigment.id}
                                                    close={close}
                                                    setRefreshList={setRefreshList}/>}
                    </Popup>

                    <td>
                        <i className="bi bi-arrow-counterclockwise btn disabled p-0 text-blue fw-bold"/>
                    </td>


                </>
            )
        } else if (state === "Accepted") {
            return (
                <>
                    <td>
                        <i
                            className="bi bi-pen btn disabled m-0 p-0"
                        />
                    </td>
                    <td>
                        <i
                            className="bi bi-x-circle btn disabled p-0"
                        />
                    </td>
                    <Popup
                        contentStyle={{
                            width: "27%", border: "1px solid black", borderRadius: 10,
                            overflow: 'hidden'
                        }}
                        trigger={
                            <td>
                                <i className="bi btn m-0 p-0 zoomin bi-arrow-counterclockwise text-blue fw-bold"
                                />
                            </td>
                        }
                        closeOnDocumentClick={false}
                        modal

                    >
                        {(close) => <ReturnPopup assigment={assigment}
                                                 setState={setState}
                                                 close={close}
                                                 setDisable={setDisable}
                        />}
                    </Popup>
                </>
            )
        } else if (state === "Decline") {
            return (
                <>
                    <td>
                        <i
                            className="bi bi-pen btn disabled m-0 p-0"
                        />
                    </td>
                    <Popup
                        contentStyle={{
                            width: "25%",
                            border: "1px solid black",
                            borderRadius: 10,
                            overflow: "hidden",
                        }}
                        trigger={
                            <td>
                                <i className="bi bi-x-circle text-danger btn p-0 zoomin"/>
                            </td>
                        }
                        modal
                        closeOnDocumentClick={false}
                    >
                        {close => <DeleteAssignment id={assigment.id}
                                                    close={close}
                                                    setRefreshList={setRefreshList}
                                                    setDisable={setDisable}
                        />
                        }
                    </Popup>
                    <td>
                        <i className="bi bi-arrow-counterclockwise btn disabled p-0 text-blue fw-bold"/>
                    </td>
                </>
            )
        } else if (state === "Waiting for returning") {
            return (
                <>
                    <td>
                        <i className="bi bi-pen btn disabled m-0 p-0"/>
                    </td>
                    <td>
                        <i className="bi bi-x-circle btn disabled p-0"/>
                    </td>
                    <td>
                        <i className="bi bi-arrow-counterclockwise btn disabled p-0 text-blue fw-bold"/>
                    </td>
                </>
            )
        }
    }
    const sortingData = useMemo(() => {
        if (sortConfig !== null) {
            list.sort((a, b) => {
                if (sortConfig.key === 'assetCode') {
                    if (a.assetDTO.assetCode < b.assetDTO.assetCode)
                        return sortConfig.direction === "asc" ? -1 : 1;
                    if (a.assetDTO.assetCode > b.assetDTO.assetCode)
                        return sortConfig.direction === "asc" ? 1 : -1;
                }
                if (sortConfig.key === 'assetName') {
                    if (a.assetDTO.assetName < b.assetDTO.assetName)
                        return sortConfig.direction === "asc" ? -1 : 1;
                    if (a.assetDTO.assetName > b.assetDTO.assetName)
                        return sortConfig.direction === "asc" ? 1 : -1;
                }
                if (sortConfig.key === 'username') {
                    if (a.userDTO.username < b.userDTO.username)
                        return sortConfig.direction === "asc" ? -1 : 1;
                    if (a.userDTO.username > b.userDTO.username)
                        return sortConfig.direction === "asc" ? 1 : -1;
                }
                if (a[sortConfig.key] <= b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] >= b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
    }, [sortConfig]);
    const requestSort = (key) => {
        let direction = "asc";
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === "asc"
        ) {
            direction = "desc";
        }
        setSortConfig({key, direction});
    };
    const getClassNamesFor = (name) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };
    let i = 1;
    const [disable, setDisable] = useState(false);
    console.log(disable);
    return (
        <Container fluid className={"d-block ps-5"}>
            <h3 className={"text-danger mb-3"}>Assignment List</h3>
            <InputGroup className={"justify-content-between"}>
                <div className={"col-4 d-flex"}>
                    <InputGroup>
                        <Form.Control
                            as="select"
                            custom
                            className={"w-25 border-end-0 border-secondary"}
                            placeholder={"State"}
                            name={"state"}
                            onChange={handleFilterType}
                        >
                            <option>State</option>
                            <option value="5">Waiting for acceptance</option>
                            <option value="6">Accepted</option>
                            <option value="7">Decline</option>
                            <option value="8">Waiting for returning</option>
                        </Form.Control>
                        <Button variant={"outline-secondary"}
                                className={"border-start-0"}
                        >
                            <i className="bi bi-funnel-fill"/>
                        </Button>
                    </InputGroup>
                    <InputGroup>
                        <Form.Control
                            type={"date"}
                            className={"w-25 ms-5 border-secondary"}
                            placeholder={"Assigned Date"}
                            name={"assignedDate"}
                            onChange={handleFilterAssignedDate}
                        />
                    </InputGroup>
                </div>
                <div className={"col-8 d-flex justify-content-end"}>
                    <InputGroup className={"w-auto"}>
                        <Form.Control
                            type={"input"}
                            name={"searchTerm"}
                            onChange={handleFilterSearch}
                            maxLength={255}
                            className={"border-secondary border-end-0"}
                        />
                        <Button
                            variant={"outline-secondary"}
                            className={"me-5 border-start-0"}
                        >
                            <i className={"bi bi-search"}/>
                        </Button>
                    </InputGroup>
                    <Button
                        variant={"danger"}
                        className={"w-auto"}
                        onClick={() => {
                            setChildPage("Create New Assignment");
                            history.push("/createAssignment");
                        }}
                    >
                        Create new Assignment
                    </Button>

                </div>
            </InputGroup>
            <Row className={"mt-5"}>
                <Table>
                    <thead>
                    <tr>
                        <th
                            className={"border-bottom"}
                            className={getClassNamesFor("id")}
                            onClick={() => requestSort("id")}
                        >
                            No.
                        </th>
                        <th
                            className={"border-bottom"}
                            className={getClassNamesFor("assetCode")}
                            onClick={() => requestSort("assetCode")}
                        >
                            Asset Code
                        </th>
                        <th
                            className={"border-bottom"}
                            className={getClassNamesFor("assetName")}
                            onClick={() => requestSort("assetName")}
                        >
                            Asset Name
                        </th>
                        <th
                            className={"border-bottom"}
                            className={getClassNamesFor("username")}
                            onClick={() => requestSort("username")}
                        >
                            Assigned To
                        </th>
                        <th
                            className={"border-bottom"}
                            className={getClassNamesFor("assignedBy")}
                            onClick={() => requestSort("assignedBy")}
                        >
                            Assigned By
                        </th>
                        <th
                            className={"border-bottom"}
                            className={getClassNamesFor("assignedDate")}
                            onClick={() => requestSort("assignedDate")}
                        >
                            Assigned Date
                        </th>
                        <th
                            className={"border-bottom"}
                            className={getClassNamesFor("state")}
                            onClick={() => requestSort("state")}
                        >
                            State
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {list.slice(indexOfFirstUser, indexOfLastUser).map((assigment) => (
                        <Popup
                            contentStyle={{
                                width: "25%",
                                border: "1px solid black",
                                borderRadius: 10,
                                overflow: "hidden",
                                padding: "20px",
                            }}
                            trigger={
                                <tr key={assigment.id}>
                                    <td>{i++}</td>
                                    <td>{assigment.assetDTO.assetCode}</td>
                                    <td>{assigment.assetDTO.assetName}</td>
                                    <td>{assigment.userDTO.username}</td>
                                    <td>{assigment.assignedBy}</td>
                                    <td>{dateFormat(assigment.assignedDate, "dd/mm/yyyy")}</td>
                                    <td>{assigment.state}</td>
                                    {checkButton(assigment.state, assigment)}
                                </tr>
                            }
                            modal
                            disabled={disable}
                        >
                            {(close) => (
                                <div>
                                    <ViewDetailAssignment id={assigment.id}/>
                                    <Button
                                        onClick={close}
                                        variant="success"
                                        className="btn-view-detail"
                                    >
                                        &times;
                                    </Button>
                                </div>
                            )}
                        </Popup>
                    ))}
                    </tbody>
                </Table>
            </Row>
            <Pagination
                className="pagnition"
                usersPerPage={usersPerPage}
                totalUsers={list.length}
                paginate={paginate}
            />
        </Container>
    );
};

export default ManageAssignment;
