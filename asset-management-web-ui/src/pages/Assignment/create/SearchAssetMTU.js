import React, {useEffect, useRef, useState} from 'react';
import {Table, Divider} from 'antd';
import 'antd/dist/antd.css';
import './index.css';
import axios from "axios";
import {Button, FormControl, InputGroup, Row} from "react-bootstrap";

const rootAPI = process.env.REACT_APP_SERVER_URL;
const columns = [
    {
        title: 'Asset Code',
        dataIndex: 'assetCode',
        render: (text) => <a>{text}</a>,
        sorter: {
            compare: (a, b) => a.assetCode.localeCompare(b.assetCode),
            multiple: 2
        }
    },
    {
        title: 'Asset Name',
        dataIndex: 'assetName',
        sorter: {
            compare: (a, b) => a.assetName.localeCompare(b.assetName),
            multiple: 3
        }
    },
    {
        title: 'Category',
        dataIndex: 'category',
        sorter: {
            compare: (a, b) => a.category.localeCompare(b.category),
            multiple: 3
        }
    },
];

const SearchAssetAntD = props => {
    const isFirstRun = useRef(true);
    let {setAssetSelect, close} = props;
    const [searchTerm, setSearchTerm] = useState("");
    const [asset, setAsset] = useState([{
        id: null,
        assetCode: null,
        assetName: null,
        categoryDTO: {
            name: null
        },
        state: null
    }]);
    useEffect(() => {
        axios.get(rootAPI + '/assets?type=0')
            .then(response => {
                setAsset(response.data)
            })
    }, [])
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setAssetSelect({
                id: selectedRows[0].key,
                assetCode: selectedRows[0].assetCode,
                assetName: selectedRows[0].assetName
            })
        }
    };
    const data = []; // rowSelection object indicates the need for row selection
    asset.map(asset => {
        data.push({
            key: asset.id,
            assetCode: asset.assetCode,
            assetName: asset.assetName,
            category: asset.categoryDTO.name
        })
    })
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        axios.get(rootAPI + '/assets?type=0&searchTerm=' + searchTerm)
            .then(response => {
                setAsset(response.data);
            })
    }, [searchTerm])

    return (
      <div>
        <Row className={"justify-content-between align-items-center"}>
          <h3 className={"text-danger w-auto m-0ky"}>Select Asset</h3>
          <InputGroup className={"w-50"}>
            <FormControl
              type={"input"}
              className={"w-50"}
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
        </Row>
        <Divider />
        <Table
          rowSelection={{
            type: "radio",
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
        />
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
              setAssetSelect({ id: null, assetCode: "", assetName: "" });
              close();
            }}
          >
            CANCEL
          </Button>
        </Row>
      </div>
    );
};
export default SearchAssetAntD;