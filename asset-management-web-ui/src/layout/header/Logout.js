import './Logout.css'

import {Button, ButtonGroup, Row} from "react-bootstrap";

import React from 'react';

const Logout = ({close}) => {

    const refreshPage = () => {
        window.location.reload();
    }

    const onSubmit = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("jwttoken");
        localStorage.removeItem("authority");
        window.location.href = "/login";
    }

    return (
        <div>
            <Row>
                <h3 className={"text-danger"}>Are you sure?</h3>
            </Row>
            <hr/>
            <p>Do you want to Logout?</p>

            {/* <Row> */}
            {/* <ButtonGroup>
                    <Button variant={"danger"} className={"mx-5 border-btn"} onClick={onSubmit}>Logout</Button>{' '}
                    <Button variant={"secondary "} className={"mx-5 border-btn"} onClick={() => close()}>Cancel</Button>
                   </ ButtonGroup> */}

            <Row className={"justify-content-between"}>
                <Button variant={"danger"} className={"ms-2 col-5"} onClick={onSubmit}>Logout</Button>
                <Button variant={"secondary"} className={"me-2 col-5"} onClick={() => close()}>Cancel</Button>

            </Row>
        </div>
    );
};

export default Logout;