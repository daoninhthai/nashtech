import React, { useEffect, useState } from "react";
import axios from "axios";
import dateFormat from 'dateformat';
import '../../ManageAll/ManageAsset/viewDetails/ViewDetailedAsset.css'

const ViewDetailAssignment = props => {
  const rootAPI = process.env.REACT_APP_SERVER_URL;
  let {id,close} = props;
  const [assignment, setAssignment] = useState({
    id: "",
    assetDTO: {
        assetCode: "",
        assetName: "",
    },
    userDTO: {
        name: "",
    },
    assignedDate: "",
    state: ""
  });
  
  useEffect(() => {
    loadAsset();
  }, []);
  const loadAsset = async () => {
    const res = await axios.get(rootAPI+`/assignments/${id}`);
    setAssignment(res.data);
  };
  const check = state => {
    if(state === 5){
      return <span>Waiting for acceptance</span>
    }
    if(state === 6){
      return <span>Accepted</span>
    }
    if(state === 7){
      return <span>Decline</span>
    }
    if(state === 8){
      return <span>Waiting for returning</span>
    }
  }

  return (
   <div >
    <div><h3 className="title-detail-asset">
         Detailed information of assignment
         </h3></div> 
     <div>
     <table> 
       <tbody>
       <tr>
         <td className="fields-name">Asset Code</td>
         <td>: {assignment.assetDTO.assetCode}</td>
       </tr>
       <tr>
         <td className="fields-name">Asset Name</td>
         <td>: {assignment.assetDTO.assetName}</td>
       </tr>
       <tr>
         <td className="fields-name">Assigned To</td>
         <td>: {assignment.userDTO.username}</td>
       </tr>
       <tr>
         <td className="fields-name">Assigned By</td>
         <td>: {assignment.assignedBy}</td>
       </tr>
       <tr>
         <td className="fields-name">Assigned Date</td>
         <td>: {dateFormat(assignment.assignedDate, "dd/mm/yyyy")}</td>
       </tr>
       <tr>
         <td className="fields-name">State</td>
         <td>: {check(assignment.state)}</td>
       </tr>
       <tr>
         <td className="fields-name">Note</td>
         <td>: {assignment.note}</td>
       </tr>
       </tbody>
     </table>
     </div>
    </div>
    
  );
};

export default ViewDetailAssignment;