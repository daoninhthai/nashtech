import React from 'react'
import {Button, ButtonGroup, Row} from "react-bootstrap";
import axios from "axios";

const DeleteRequest = props => {
    const rootAPI = process.env.REACT_APP_SERVER_URL;
    let {id, close,setRefreshList, refreshList} = props;
    const onSubmit = () => {
        axios
            .delete(rootAPI + `/request/${id}`)
            .then(function (response) {
                setRefreshList(true);
                close();
            });
    }
    return (
        <div>
            <h3 className={"text-danger"} style={{padding: '10px 20px'}}>Are you sure?</h3>
            <hr style={{margin: '0'}}/>
            <Row style={{padding: '10px 20px'}}>
                <p>Do you want to cancel this this returning request?</p>
                <ButtonGroup className={"w-50"}>
                    <Button variant={"danger"} className={""} onClick={() =>{onSubmit(close)}}>DECLINE</Button>
                </ButtonGroup>
                <ButtonGroup className={"w-50"}>
                    <Button variant={"secondary"} className={""} onClick={() =>close()}>NO</Button>
                </ButtonGroup>
            </Row>
        </div>
    )
}

export default DeleteRequest;