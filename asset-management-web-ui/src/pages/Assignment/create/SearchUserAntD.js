import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Button, Form, InputGroup, Row} from "react-bootstrap";
import {Divider, Table} from "antd";
const rootAPI = process.env.REACT_APP_SERVER_URL;
const columns = [
    {
        title: 'Staff Code',
        dataIndex: 'staffCode',
        render: (text) => <a>{text}</a>,
        sorter:{
            compare:(a,b) => a.staffCode.localeCompare(b.staffCode),
            multiple:2
        }
    },
    {
        title: 'Full Name',
        dataIndex: 'fullName',
        sorter:{
            compare:(a,b) => a.fullName.localeCompare(b.fullName),
            multiple:3
        }
    },
    {
        title: 'Type',
        dataIndex: 'authority',
        sorter:{
            compare:(a,b) => a.authority.localeCompare(b.authority),
            multiple:3
        }
    },
];
function capitalizeFirstLetter(string) {
    return string?.charAt(0) + string?.slice(1).toLowerCase();
}
const SearchUserAntD = (props) => {
    let {setSingleUser, close} = props;
    const [searchTerm, setSearchTerm] = useState("");
    const [user, setUser] = useState([{
        username: null,
        id: null,
        firstName: null,
        lastName: null,
        authority: null,
        status: null,
        staffCode: null
    }]);

    const request= {
        params:{
            searchTerm: searchTerm,
        }
    }
    useEffect(() => {
        axios
            .get(rootAPI + "/users",request)
            .then((response) => {
                setUser(response.data);
            });
    }, [searchTerm])
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSingleUser({
                id: selectedRows[0].key,
                username: selectedRows[0].username
            })
        }
    };
    const data = []; // rowSelection object indicates the need for row selection
    user.map(user => {
        data.push({
            key: user.id,
            staffCode: user.staffCode,
            fullName: `${user.firstName} ${user.lastName}`,
            authority: capitalizeFirstLetter(user.authority),
            username: user.username
        })
    })

    return (
      <div>
        <Row>
          <h3 className={"text-danger w-50"}>Select User</h3>
          <InputGroup className={"w-50"}>
            <Form.Control
              type={"input"}
              className={"w-25"}
              name={"searchTerm"}
              onChange={(evt) => {
                setSearchTerm(evt.target.value);
              }}
              maxLength={255}
            />
            <Button variant={"outline-secondary"} className={"me-5"}>
              <i className="bi bi-search" />
            </Button>
          </InputGroup>
          <Divider />
          <Table
            rowSelection={{
              type: "radio",
              ...rowSelection,
            }}
            columns={columns}
            dataSource={data}
          />
        </Row>
        <Row className={"justify-content-end"}>
          <Button
            variant={"danger"}
            className={"w-25 mx-5"}
            onClick={() => close()}
          >
            SAVE
          </Button>
          <Button
            variant={"secondary"}
            className={"w-25 me-3"}
            onClick={() => {
              setSingleUser({ id: null, username: "" });
              close();
            }}
          >
            CANCEL
          </Button>
        </Row>
      </div>
    );
};

export default SearchUserAntD;