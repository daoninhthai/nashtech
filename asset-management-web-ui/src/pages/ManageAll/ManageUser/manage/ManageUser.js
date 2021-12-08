import 'bootstrap/dist/css/bootstrap.min.css'
import './Manage.css'
import 'reactjs-popup/dist/index.css';
import {Button, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import {useEffect, useRef, useMemo, useState} from 'react';
import ChangeStatus from '../changeStatus/ChangeStatus';
import Pagination from '../../../../components/Pagination/Pagination'
import Popup from "reactjs-popup";
import React from 'react';
import ViewDetailedUser from "../viewDetails/ViewDetailedUser"
import axios from "axios";
import {useHistory} from 'react-router-dom'
import dateFormat from 'dateformat';

import '../../../../style/style.css'
import ChangeStatusFail from "../changeStatus/ChangeStatusFail";

const ManageUser = ({responseUser, setChildPage, setCurrentPages, setResponseUser}) => {

    const token = localStorage.getItem('jwttoken')
    const headers = {
        'Authorization': token
    };
    const rootAPI = process.env.REACT_APP_SERVER_URL;
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState(null);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const [refresh, setRefresh] = useState(true);
    const [disable, setDisable] = useState("false");
    const paginate = pageNumber => setCurrentPage(pageNumber);
    const history = useHistory();

    const [list, setList] = useState([{
        staffCode: null,
        firstName: null,
        lastName: null,
        username: null,
        joinedDate: null,
        authority: null,
        status: null,
        assignments: [{
            state: null
        }]
    }]);
    console.log(list)
    useEffect(() => {
        axios.get(rootAPI + '/users', {headers})
            .then(function (response) {
                setDisable(false);
                setRefresh(true);
                setCurrentPages("Manage User")
                let result = response.data.map(user => user.id);
                if (responseUser && result.includes(responseUser.id)) {
                    const index = result.indexOf(responseUser.id);
                    const newUser = response.data.splice(index, 1)[0];
                    response.data.unshift(newUser);
                    setList(response.data);
                    setResponseUser(null);
                } else {
                    setList(response.data);
                }
            })
    }, [refresh])

    const [type, setType] = useState();
    const [searchTerm, setSearchTerm] = useState();
    const request = {
        headers: headers,
        params: {
            type,
            searchTerm
        }
    }

    const handleFilterType = evt => {
        setType(evt.target.value)
    }

    const handleSearch = evt => {
        setSearchTerm(evt.target.value)
    }

    const isFirstRun = useRef(true);
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        if (request.params.type === 'Type') {
            request.params.type = null;

        }
        if (request.params.searchTerm === '') {
            request.params.searchTerm = null;

        }
        axios.get(rootAPI + '/users', request)
            .then(function (response) {
                setCurrentPage(1);
                setList(response.data);
            })
    }, [type, searchTerm])

    const sortingData = useMemo(() => {
        let listData = list;
        if (sortConfig !== null) {
            listData.sort((a, b) => {
                if (a[sortConfig.key] < (b[sortConfig.key])) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > (b[sortConfig.key])) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            })
        }
    }, [list, sortConfig]);

    const requestSort = key => {
        let direction = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({key, direction});
    }

    const getClassNamesFor = (name) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    function capitalizeFirstLetter(string) {
        return string?.charAt(0) + string?.slice(1).toLowerCase();
    }

    return (
        <Container fluid className={"d-block ps-5"}>
            <h3 className={"text-danger mb-3"}>User List</h3>
            <div className={"justify-content-between d-flex"}>
                <div className={"col-3 d-flex"}>
                    <InputGroup className={"w-50"}>
                        <Form.Control
                            as="select"
                            custom
                            placeholder={"Type"}
                            name={"type"}
                            onChange={handleFilterType}
                            className={"border-end-0 border-secondary"}
                        >
                            <option value={"Type"}>Type</option>
                            <option value="Admin">Admin</option>
                            <option value="Staff">Staff</option>
                        </Form.Control>
                        <Button variant={"outline-secondary"}
                                className={"border-start-0"}
                        >
                            <i className="bi bi-funnel-fill"/>
                        </Button>
                    </InputGroup>
                </div>
                <div className={"col-6 d-flex justify-content-end"}>
                    <InputGroup className={"w-50"}>
                        <FormControl
                            type={"text"}
                            name={"searchTerm"}
                            onChange={handleSearch}
                            maxLength={255}
                            className={"border-end-0 border-secondary"}
                        />
                        <Button variant={"outline-secondary"}
                                className={"border-start-0"}
                        >
                            <i className="bi bi-search"/>
                        </Button>
                    </InputGroup>
                    <Button
                        variant={"danger"}
                        className={"w-auto ms-5"}
                        onClick={() => {
                            setChildPage("Create New User");
                            history.push("/createuser");
                        }}
                    >
                        Create new user
                    </Button>
                </div>
            </div>
            <Row className={"mt-5"}>
                <Table>
                    <thead>
                    <tr>
                        <th
                            className={"border-bottom"}
                            className={getClassNamesFor("staffCode")}
                            onClick={() => requestSort("staffCode")}
                        >
                            Staff Code
                        </th>
                        <th
                            className={"border-bottom"}
                            className={getClassNamesFor("firstName")}
                            onClick={() => requestSort("firstName")}
                        >
                            Full Name
                        </th>
                        <th
                            className={"border-bottom"}
                            className={getClassNamesFor("username")}
                            onClick={() => requestSort("username")}
                        >
                            User Name
                        </th>
                        <th
                            className={"border-bottom"}
                            className={getClassNamesFor("joinedDate")}
                            onClick={() => requestSort("joinedDate")}
                        >
                            Joined Date
                        </th>
                        <th
                            className={"border-bottom"}
                            className={getClassNamesFor("authority")}
                            onClick={() => requestSort("authority")}
                        >
                            Type
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {list.slice(indexOfFirstUser, indexOfLastUser).map((user) => (
                        <Popup
                            key={user.id}
                            contentStyle={{
                                width: "25%",
                                border: "1px solid black",
                                borderRadius: 10,
                                overflow: "hidden",
                                padding: "20px",
                            }}
                            trigger={
                                <tr key={user.id}>
                                    <td>{user.staffCode}</td>
                                    <td>
                                        {user.firstName} {user.lastName}
                                    </td>
                                    <td>{user.username}</td>
                                    <td>{dateFormat(user.joinedDate, "dd/mm/yyyy")}</td>
                                    <td>{capitalizeFirstLetter(user.authority)}</td>
                                    <td>
                                        <i className="bi bi-pen btn m-0 text-muted p-0 zoomin"
                                           onClick={() => {
                                               setChildPage("Edit User");
                                               history.push(`/edituser/${user.id}`)
                                           }}
                                        />
                                    </td>
                                    <Popup
                                        contentStyle={{
                                            width: "27%",
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
                                        {(close) => {
                                            if (user.assignments?.length !== 0) {
                                                return <ChangeStatusFail close={close}/>;
                                            } else {
                                                return <ChangeStatus id={user.id}
                                                                     close={close}
                                                                     setRefresh={setRefresh}
                                                                     setDisable={setDisable}
                                                />;
                                            }
                                        }}
                                    </Popup>
                                </tr>
                            }
                            modal
                            disabled={disable}
                        >
                            {(close) => (
                                <div>
                                    <ViewDetailedUser id={user.id}/>
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

export default ManageUser;