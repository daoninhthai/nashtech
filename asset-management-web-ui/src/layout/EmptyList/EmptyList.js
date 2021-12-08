import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row} from "react-bootstrap";

import EmptySVG from '../../style/blank.svg'

const EmptyList = () => {
    return (
        <>
            <div className={"text-center"}>
                You got no assignment yet
            </div>
            <Row className={"justify-content-center align-items-center"}>
               <img src={EmptySVG} className={"w-50 h-50"} alt={"Empty"}/>
            </Row>
        </>
    );
};

export default EmptyList;