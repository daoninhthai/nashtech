import './ViewDetailedAsset.css'
import React, { useEffect, useState } from "react";

import axios from "axios";
import dateFormat from 'dateformat';

const ViewDetailedAsset = props => {
  const rootAPI = process.env.REACT_APP_SERVER_URL;
  let {id} = props;
  const [asset, setAsset] = useState({
    id: "",
    asset_code: "",
    asset_name: "",
    specification: "",
    installed_date: "",
    state: "",
    location: "",
    categoryDTO:{
      name: ""
    }
  });
  
  useEffect(() => {
    loadAsset();
  }, []);
  const loadAsset = async () => {
    const res = await axios.get(rootAPI+`/assets/${id}`);
    setAsset(res.data);
  };
  const check = state => {
    if(state === 0){
      return <span>Available</span>
    }
    if(state === 1){
      return <span>Not available</span>
    }
    if(state === 2){
      return <span>Waiting for recycling</span>
    }
    if(state === 3){
      return <span>Recycled</span>
    }
    if (state === 4) {
      return <span>Assigned</span>;
    }
  }

  return (
   <div >
    <div><h3 className="title-detail-asset">
         Detailed information of asset
         </h3></div> 
     <div>
     <table> 
       <tbody>
       <tr>
         <td className="fields-name">Asset Code</td>
         <td>: {asset.assetCode}</td>
       </tr>
       <tr>
         <td className="fields-name">Asset Name</td>
         <td>: {asset.assetName}</td>
       </tr>
       <tr>
         <td className="fields-name">Specification</td>
         <td>: {asset.specification}</td>
       </tr>
       <tr>
         <td className="fields-name">Installed date</td>
         <td>: {dateFormat(asset.installedDate, "dd/mm/yyyy")}</td>
       </tr>
       <tr>
         <td className="fields-name">State</td>
         <td>: {check(asset.state)}</td>
       </tr>
       <tr>
         <td className="fields-name">Location</td>
         <td>: {asset.location}</td>
       </tr>
       <tr>
         <td className="fields-name">Category</td>
         <td>: {asset.categoryDTO.name}</td>
       </tr>
       </tbody>
     </table>
     </div>
    </div>
    
  );
};

export default ViewDetailedAsset;