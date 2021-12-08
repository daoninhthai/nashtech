import React, {useEffect} from 'react'
import {Button, ButtonGroup, Row} from "react-bootstrap";
import axios from "axios";

const DeleteAssignment = props => {
    const rootAPI = process.env.REACT_APP_SERVER_URL;
    let {id, close, setRefreshList, setDisable} = props;
    console.log(id);
    useEffect(() => {
        setDisable(true)
    })
    const onSubmit = () => {
        axios
            .delete(rootAPI + `/assignments/${id}`)
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
                <p>Do you want to delete this assignment?</p>
                <ButtonGroup className={"w-50"}>
                    <Button variant={"danger"} className={"px-5"} onClick={() => {
                        onSubmit(close)
                    }}>DELETE</Button>
                </ButtonGroup>
                <ButtonGroup className={"w-50"}>
                    <Button variant={"secondary"} className={"px-5"} onClick={() => {
                        setDisable(false);
                        close()
                    }}>CANCEL</Button>
                </ButtonGroup>
            </Row>
        </div>
    )
}

export default DeleteAssignment;