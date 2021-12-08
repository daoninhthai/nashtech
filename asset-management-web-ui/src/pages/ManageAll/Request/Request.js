import React, {useEffect, useState, useMemo} from 'react';
import {Button, Container, Form, FormControl, InputGroup, Row, Table} from "react-bootstrap";
import 'react-calendar/dist/Calendar.css';
import axios from "axios";
import Popup from 'reactjs-popup';
import DeleteRequest from './DeleteRequest';
import CompleteRequest from './CompleteRequest';
import dateFormat from 'dateformat';
import moment from "moment";
import Pagination from "../../../components/Pagination/Pagination";

const Request = ({setCurrentPages, responseRequest}) => {
    const rootAPI = process.env.REACT_APP_SERVER_URL;
    const [sortConfig, setSortConfig] = useState(null);
    const [state, setState] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [refreshList, setRefreshList] = useState(false);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const [list, setList] = useState([]);

    const [date, setDate] = useState();
    const [searchTerm, setSearchTerm] = useState();
    const request = {
        params: {
            state,
            date,
            searchTerm
        }
    }
    const sortingData = useMemo(() => {
        if (sortConfig !== null) {
            list.sort((a, b) => {
                if (sortConfig.key === 'username') {
                    if (a.assignmentDTO.userDTO.username < b.assignmentDTO.userDTO.username)
                        return sortConfig.direction === "asc" ? -1 : 1;
                    if (a.assignmentDTO.userDTO.username > b.assignmentDTO.userDTO.username)
                        return sortConfig.direction === "asc" ? 1 : -1;
                }
                if (sortConfig.key === 'assetName') {
                    if (a.assignmentDTO.assetDTO.assetName < b.assignmentDTO.assetDTO.assetName)
                        return sortConfig.direction === "asc" ? -1 : 1;
                    if (a.assignmentDTO.assetDTO.assetName > b.assignmentDTO.assetDTO.assetName)
                        return sortConfig.direction === "asc" ? 1 : -1;
                }
                if (sortConfig.key === 'assetCode') {
                    if (a.assignmentDTO.assetDTO.assetCode < b.assignmentDTO.assetDTO.assetCode)
                        return sortConfig.direction === "asc" ? -1 : 1;
                    if (a.assignmentDTO.assetDTO.assetCode > b.assignmentDTO.assetDTO.assetCode)
                        return sortConfig.direction === "asc" ? 1 : -1;
                }
                if (sortConfig.key === 'state') {
                    if (a.assignmentDTO.assetDTO.state < b.assignmentDTO.assetDTO.state)
                        return sortConfig.direction === "asc" ? -1 : 1;
                    if (a.assignmentDTO.assetDTO.state > b.assignmentDTO.assetDTO.state)
                        return sortConfig.direction === "asc" ? 1 : -1;
                }
                if (sortConfig.key === 'assignedDate') {
                    if (a.assignmentDTO.assignedDate < b.assignmentDTO.assignedDate)
                        return sortConfig.direction === "asc" ? -1 : 1;
                    if (a.assignmentDTO.assignedDate > b.assignmentDTO.assignedDate)
                        return sortConfig.direction === "asc" ? 1 : -1;
                }
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
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
    const handleFilterState = evt => {
        setState(evt.target.value)
    }
    const handleFilterDate = evt => {
        setDate(evt.target.value)
    }
    const handleSearch = evt => {
        setSearchTerm(evt.target.value)
    }
    useEffect(() => {
        if (request.params.state === "State") {
            request.params.state = null;
        }
        if (request.params.date === "Assigned Date") {
            request.params.date = null;
        }
        if (!request.params.searchTerm) {
            request.params.searchTerm = null
        }
        axios.get(rootAPI + `/request`, request)
            .then(function (response) {
                let result = response.data.map((request) => request.id);
                if (result.includes(responseRequest.id)) {
                    const index = result.indexOf(responseRequest.id);
                    response.data.splice(index, 1);
                    response.data.unshift(responseRequest);
                    setList(response.data);
                } else {
                    setList(response.data);
                }
                setCurrentPages("Request For Returning")
                setRefreshList(false);
            })
    }, [state, date, searchTerm, refreshList])
    list.map(request => {
        if(request.assignmentDTO.state === 8){
            request.assignmentDTO.state = "Waiting for returning";
        }if(request.assignmentDTO.state === -1){
            request.assignmentDTO.state = "Completed";
        }
    })
    let i = 1;
    console.log(refreshList);
    return (
        <Container fluid className={"d-block ps-5"}>
            <h3 className={"text-danger mb-3"}>Request List</h3>
            <InputGroup className={"justify-content-between"}>
                <div className={"col-4 d-flex"}>
                    <InputGroup>
                        <Form.Control
                            as="select"
                            custom
                            name={"state"}
                            onChange={handleFilterState}
                            className={"border-secondary border-end-0"}
                        >
                            <option>State</option>
                            <option value="0">Waiting for returning</option>
                            <option value="1">Completed</option>
                        </Form.Control>
                        <Button
                            variant={"outline-secondary"}
                            className={"me-5 border-start-0"}
                        >
                            <i className="bi bi-funnel-fill"/></Button>
                    </InputGroup>
                    <InputGroup>
                        <Form.Control
                            type={"date"}
                            className={"ms-3 border-secondary"}
                            onChange={handleFilterDate}
                        />
                    </InputGroup>
                </div>
                <div className={"col-3 d-flex"}>
                    <InputGroup>
                        <FormControl
                            type={"input"}
                            className={"w-25 border-end-0 border-secondary"}
                            name={"searchTerm"}
                            onChange={handleSearch}
                        >
                        </FormControl>
                        <Button variant={"outline-secondary"}
                                className={"me-5 border-start-0"}
                        ><i className="bi bi-search"/>
                        </Button>
                    </InputGroup>
                </div>

            </InputGroup>

            <Row className={"mt-5"}>
                <Table>
                    <thead>
                    <tr>
                        <th className={"border-bottom"}
                            className={getClassNamesFor("id")}
                            onClick={() => requestSort("id")}
                        >No.
                        </th>
                        <th className={"border-bottom"}
                            className={getClassNamesFor("assetCode")}
                            onClick={() => requestSort("assetCode")}
                        >Asset Code
                        </th>
                        <th className={"border-bottom"}
                            className={getClassNamesFor("assetName")}
                            onClick={() => requestSort("assetName")}
                        >Asset Name
                        </th>
                        <th className={"border-bottom"}
                            className={getClassNamesFor("username")}
                            onClick={() => requestSort("username")}
                        >Request by
                        </th>
                        <th className={"border-bottom"}
                            className={getClassNamesFor("assignedDate")}
                            onClick={() => requestSort("assignedDate")}
                        >Assigned Date
                        </th>
                        <th className={"border-bottom"}
                            className={getClassNamesFor("accepted_by")}
                            onClick={() => requestSort("accepted_by")}
                        >Accepted by
                        </th>
                        <th className={"border-bottom"}
                            className={getClassNamesFor("returnedDate")}
                            onClick={() => requestSort("returnedDate")}
                        >Returned Date
                        </th>
                        <th className={"border-bottom"}
                            className={getClassNamesFor("state")}
                            onClick={() => requestSort("state")}
                        >State
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {list.slice(indexOfFirstUser, indexOfLastUser).map(request =>
                        <tr>
                            <td>{i++}</td>
                            <td>{request.assignmentDTO.assetDTO.assetCode}</td>
                            <td>{request.assignmentDTO.assetDTO.assetName}</td>
                            <td>{request.requestBy}</td>
                            <td>{dateFormat(request.assignmentDTO.assignedDate, "dd/mm/yyyy")}</td>
                            <td>{request.acceptedBy}</td>
                            {request.returnedDate ? <td>{moment(request.returnedDate).format("DD/MM/YYYY")}</td> :
                                <td/>}
                            <td>{request.assignmentDTO.state}</td>
                            {request.assignmentDTO.state === "Waiting for returning" ?
                                <>
                                    <Popup
                                        contentStyle={{
                                            width: "22%",
                                            border: "1px solid black",
                                            borderRadius: 10,
                                            overflow: "hidden",
                                        }}
                                        trigger={
                                            <td><i className="bi bi-check-lg text-danger btn m-0 p-0 zoomin"/></td>
                                        }
                                        closeOnDocumentClick={false}
                                        modal
                                    >
                                        {close => <CompleteRequest id={request.id} assign={request} close={close}
                                                                   setRefreshList={setRefreshList}/>}
                                    </Popup>
                                    <Popup
                                        contentStyle={{
                                            width: "22%",
                                            border: "1px solid black",
                                            borderRadius: 10,
                                            overflow: "hidden",
                                        }}
                                        trigger={
                                            <td><i className="bi bi-x-lg text-dark fw-bold btn m-0 p-0 zoomin"/></td>
                                        }
                                        closeOnDocumentClick={false}
                                        modal
                                    >
                                        {close => <DeleteRequest id={request.id} setRefreshList={setRefreshList}
                                                                 refreshList={refreshList} close={close}/>}
                                    </Popup>
                                </>
                                :
                                <>
                                    <td><i className="bi bi-check-lg text-danger btn disabled m-0 p-0"/></td>
                                    <td><i className="bi bi-x-lg text-dark btn disabled fw-bold m-0 p-0"/></td>
                                </>
                            }
                        </tr>
                    )}
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
    )
        ;
};

export default Request;