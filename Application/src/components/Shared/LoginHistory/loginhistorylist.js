import React, { useEffect, useState } from "react";
import Axios from "axios"; // make request thru api
import { FaSortNumericDownAlt } from "react-icons/fa";
import { FaSortNumericDown } from "react-icons/fa";
import "./style.css";

const LoginHistoryList = (props) => {
  const [loginHistory, setLoginHistory] = useState([]); //to store data & render in DOM
  const [isAscSort, setIsAscSort] = useState(undefined);

  useEffect(() => {
    getLoginHistory(props.email);
  }, [props.email]);

  const getLoginHistory = (email) => {
    Axios.post("/usersloginhistory", { email }) // fetch api to read files
      .then((res) => {
        let loginHistory = res.data[0];
        //console.log(loginHistory);
        setLoginHistory(loginHistory);
      });
  };

  //handle ascending sort
  const onSort = (e) => {
    // to decide asc/des or no icon display
    let ascSort = isAscSort;
    ascSort = !ascSort
    setIsAscSort(ascSort);
    
    // copy login history from state
    let history = [...loginHistory];
    if (ascSort === true) {
      history.sort((a,b) => a.datelogin.localeCompare(b.datelogin));
    } 
    else {
      history.reverse();
    }
    // set state again to re-render
    setLoginHistory(history);
  };


  return (
    <div className="">
      
      <div className="panel-body table-responsive p-2 mb-5 bg-white">
      
        <div className="panel-body">
        <h4>Login History</h4>
          {/* Table header*/}
          <table className="table table-condensed table-hover">
          
            <thead className="loginhistory-table-thead" >
              <tr>
                <th id="header-width-loginhistory"  >
                  <div type="button" onClick={(e) => onSort(e)}>
                    Login Date{" "}
                    {isAscSort === true && <span><FaSortNumericDown className="loginhistory-icon"/></span>}
                    {isAscSort === false && <span><FaSortNumericDownAlt className="loginhistory-icon"/></span>}
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {loginHistory.map((val, key) => (
                <tr key={val.id}>
                  <td>{val.datelogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoginHistoryList;
