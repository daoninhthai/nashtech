import 'bootstrap/dist/css/bootstrap.min.css'
import './Manage.css'
import 'reactjs-popup/dist/index.css';
import {Button, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import Delete from "../delete/Delete";
import DeleteFail from "../delete/DeleteFail";
import Pagination from '../../../../components/Pagination/Pagination'
import Popup from "reactjs-popup";
import ViewDetailedAsset from "../viewDetails/ViewDetailedAsset"
import axios from "axios";
import {set} from 'date-fns';
import {useHistory} from 'react-router-dom'

const ManageAsset = ({responseDataAsset, setChildPage, setCurrentPages, setResponseDataAsset}) => {
    const rootAPI = process.env.REACT_APP_SERVER_URL;
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState(null);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const paginate = pageNumber => setCurrentPage(pageNumber);
    const [list, setList] = useState([{
        id: null,
        assetCode: null,
        assetName: null,
        specification: null,
        category: null,
        state: null,
        categoryDTO: {
            name: null
        }
    }]);

    const [refreshList, setRefreshList] = useState(false);
    const history = useHistory();
    const [categories, setCategories] = useState([]);
    const [disable, setDisable] = useState(false);
    useEffect(() => {
        axios.get(rootAPI + "/categories").then((response) => {
            setCategories(response.data);
        });
    }, []);
    useEffect(() => {
        axios.get(rootAPI + '/assets')
            .then(function (response) {
                let result = response.data.map(asset => asset.id);
                if (responseDataAsset && result.includes(responseDataAsset.id)) {
                    const index = result.indexOf(responseDataAsset.id);
                    const newAsset = response.data.splice(index, 1)[0];
                    response.data.unshift(newAsset);
                    setList(response.data);
                    setResponseDataAsset(null);
                } else {
                    setList(response.data);
                }
                setCurrentPages("Manage Asset")
                setDisable(false);
                setRefreshList(false);
            })
    }, [refreshList]);
    list.map(asset => {
        if(asset.state === 0) {
            asset.state = "Available";
        }if(asset.state === 1) {
            asset.state = "Not Available";
        }if(asset.state === 2) {
            asset.state = "Waiting for recycling";
        }if(asset.state === 3) {
            asset.state = "Recycled";
        }if(asset.state === 4) {
            asset.state = "Assigned";
        }
    });
    const [type, setType] = useState();
    const [category, setCategory] = useState();
    const [searchTerm, setSearchTerm] = useState();
    const request = {
        params: {
            type,
            category,
            searchTerm
        }
    }
    const handleFilterType = evt => {
        const name = evt.target.name;
        setType(evt.target.value)
    }
    const handleFilterCategory = evt => {
        const name = evt.target.name;
        setCategory(evt.target.value)
    }
    const handleSearch = evt => {
        const name = evt.target.name;
        setSearchTerm(evt.target.value)
    }
    const isFirstRun = useRef(true);
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        if (request.params.type === 'State') {
            request.params.type = null;
        }
        if (request.params.category === 'Category') {
            request.params.category = null;
        }
        axios.get(rootAPI + `/assets`, request)
            .then(function (response) {
                setCurrentPage(1)
                setList(response.data);
            })
    }, [type, category, searchTerm])

    const sortingData = useMemo(() => {
        if (sortConfig !== null) {
            list.sort((a, b) => {
                if(sortConfig.key === 'state') {
                    if(a.state < b.state)
                    return sortConfig.direction === "asc" ? -1 : 1;
                    if(a.state > b.state)
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                if (a[sortConfig.key] < (b[sortConfig.key]) || a.categoryDTO.name < b.categoryDTO.name) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > (b[sortConfig.key]) || a.categoryDTO.name > b.categoryDTO.name) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            })
        }
    }, [sortConfig]);
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
    const initialState = {}
    const clearTypeState = () => {
        setType(null)
    }

    return (
        <Container fluid className={"d-block ps-5"}>
            <h3 className={"text-danger mb-3"}>Asset List</h3>
            <div className={"justify-content-between d-flex"}>
                <div className={"col-4 d-flex"}>
                    <InputGroup className={""}>
                        <Form.Control
                            as="select"
                            custom
                            name={"type"}
                            onChange={handleFilterType}
                            className={"border-end-0 border-secondary"}
                        >
                            <option value={null}>State</option>
                            <option value="0">Available</option>
                            <option value="1">Not Available</option>
                            <option value="2">Waiting for recycling</option>
                            <option value="3">Recycled</option>
                            <option value="4">Assigned</option>
                        </Form.Control>
                        <Button
                            variant={"outline-secondary"}
                            className={"border-start-0"}
                        >
                            <i className="bi bi-funnel-fill"/></Button>
                    </InputGroup>
                    <InputGroup>
                        <Form.Control
                            as="select"
                            custom
                            className={"ms-5 border-secondary border-end-0"}
                            placeholder={"Category"}
                            name={"category"}
                            onChange={handleFilterCategory}
                        >
                            <option>Category</option>
                            {categories.map((category) => (
                                <option value={category.name}>{category.name}</option>
                            ))}
                        </Form.Control>
                        <Button variant={"outline-secondary"}
                                className={"border-start-0"}>
                            <i className="bi bi-funnel-fill "/></Button>
                    </InputGroup>
                </div>
                <div className={"col-8 d-flex justify-content-end"}>
                    <InputGroup className={"w-50"}>
                        <FormControl
                            type={"input"}
                            name={"searchTerm"}
                            onChange={handleSearch}
                            maxLength={255}
                            className={"border-end-0 border-secondary"}
                        >
                        </FormControl>
                        <Button variant={"outline-secondary"}
                                className={"me-5 border-start-0"}
                        ><i className="bi bi-search"/>
                        </Button>
                    </InputGroup>
                    <Button variant={"danger"} className={"w-auto"} onClick={() => {
                        setChildPage("Create New Asset");
                        history.push('/createasset')
                    }}>Create
                        new Asset</Button>

                </div>
            </div>
            <Row className={"mt-5"}>
                <Table>
                    <thead>
                    <tr>
                        <th className={"border-bottom"}
                            className={getClassNamesFor('assetCode')}
                            onClick={() => requestSort('assetCode')}>Asset Code
                        </th>
                        <th className={"border-bottom"}
                            className={getClassNamesFor('assetName')}
                            onClick={() => requestSort('assetName')}>Asset Name
                        </th>
                        <th className={"border-bottom"}
                            className={getClassNamesFor('categoryDTO.name')}
                            onClick={() => requestSort('categoryDTO.name')}>Category
                        </th>
                        <th className={"border-bottom"}
                            className={getClassNamesFor('state')}
                            onClick={() => requestSort('state')}>State
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {list.slice(indexOfFirstUser, indexOfLastUser).map(asset =>
                        <Popup key={asset.id} contentStyle={{
                            width: "25%", border: "1px solid black", borderRadius: 10,
                            overflow: 'hidden', padding: "20px"
                        }} trigger={
                            <tr key={asset.id}>
                                <td>{asset.assetCode}</td>
                                <td>{asset.assetName}</td>
                                <td>{asset.categoryDTO.name}</td>
                                <td>{asset.state}</td>
                                {asset.state !== 4 ?
                                    <td><i className="bi bi-pen btn m-0 text-muted p-0 zoomin"
                                                           onClick={() => {
                                                               setChildPage("Edit Asset")
                                                               history.push(`/editasset/${asset.id}`)
                                                           }}/></td>
                                    :
                                    <td><i className="bi bi-pen btn m-0 btn disabled text-muted p-0"/></td>}

                                <Popup contentStyle={{
                                    width: "25%", border: "1px solid black", borderRadius: 10,
                                    overflow: 'hidden'
                                }}
                                       trigger={<td><i className="bi bi-x-circle text-danger btn p-0 zoomin"/></td>}
                                       modal
                                       closeOnDocumentClick={false}
                                >
                                    {asset.state !== 4 ?
                                        close => <Delete id={asset.id}
                                                         close={close}
                                                         setRefreshList={setRefreshList}
                                                         setDisable={setDisable}
                                        /> :
                                        close => <DeleteFail id={asset.id} close={close}/>}
                                </Popup>
                            </tr>
                        }
                               modal
                               disabled={disable}
                        >
                            {close => (<div>
                                <ViewDetailedAsset id={asset.id}/>
                                <Button onClick={close} variant="success" className="btn-view-detail">&times;</Button>
                            </div>)}
                        </Popup>
                    )}
                    </tbody>
                </Table>
            </Row>
            <Pagination className="pagnition"
                        usersPerPage={usersPerPage}
                        totalUsers={list.length}
                        paginate={paginate}
            >
            </Pagination>
        </Container>
    );
};

export default ManageAsset;