import "bootstrap/dist/css/bootstrap.min.css";
import "reactjs-popup/dist/index.css";
import { Container, InputGroup, Row, Table } from "react-bootstrap";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import ExportFile from "./ExportFile";
import moment from "moment";

const Report = ({setCurrentPages}) => {
  const rootAPI = process.env.REACT_APP_SERVER_URL;
  const [list, setList] = useState([]);
  const [sortConfig, setSortConfig] = useState(null);
  const fileName =
    "DataExport-" + moment().format("YYYY-MM-DD HHmmSS").toString();

  useEffect(() => {
    axios.get(rootAPI + "/assets/report").then(function (response) {
      setCurrentPages("Report")
      let newList = [];
      response.data.map((row) => {
        let obj = {
          Category: row[0],
          Total: row[1],
          Assigned: row[2],
          Available: row[3],
          NotAvailable: row[4],
          WaitingForRecycling: row[5],
          Recycled: row[6],
        };
        newList.push(obj);
      });
      setList(newList);
      // setList(response.data);
      // console.log("-------------------------------------");
      // console.log(response.data);
      // console.log("-------------------------------------");
      // console.log(response.data[0]);
      // console.log(response.data[0][0]);
    });
  }, []);

  const sortingData = useMemo(() => {
    if (sortConfig !== null) {
      list.sort((a, b) => {
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
    setSortConfig({ key, direction });
  };
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  return (
    <Container fluid className={"d-block ps-5"}>
      <h3 className={"text-danger mb-3"}>Report</h3>
      <InputGroup>
        <div className={"col-12 d-flex justify-content-end"}>
          <ExportFile apiData={list} fileName={fileName} />
        </div>
      </InputGroup>
      <Row className={"mt-5"}>
        <Table>
          <thead>
            <tr>
              <th
                className={"border-bottom"}
                className={getClassNamesFor("Category")}
                onClick={() => requestSort("Category")}
              >
                Category
              </th>
              <th
                className={"border-bottom"}
                className={getClassNamesFor("Total")}
                onClick={() => requestSort("Total")}
              >
                Total
              </th>
              <th
                className={"border-bottom"}
                className={getClassNamesFor("Assigned")}
                onClick={() => requestSort("Assigned")}
              >
                Assigned
              </th>
              <th
                className={"border-bottom"}
                className={getClassNamesFor("Available")}
                onClick={() => requestSort("Available")}
              >
                Available
              </th>
              <th
                className={"border-bottom"}
                className={getClassNamesFor("NotAvailable")}
                onClick={() => requestSort("NotAvailable")}
              >
                Not Available
              </th>
              <th
                className={"border-bottom"}
                className={getClassNamesFor("WaitingForRecycling")}
                onClick={() => requestSort("WaitingForRecycling")}
              >
                Waiting for recycling
              </th>
              <th
                className={"border-bottom"}
                className={getClassNamesFor("Recycled")}
                onClick={() => requestSort("Recycled")}
              >
                Recycled
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((row) => (
              <tr key={row.Category}>
                <td>{row.Category}</td>
                <td>{row.Total}</td>
                <td>{row.Assigned}</td>
                <td>{row.Available}</td>
                <td>{row.NotAvailable}</td>
                <td>{row.WaitingForRecycling}</td>
                <td>{row.Recycled}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};

export default Report;
