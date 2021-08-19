import React, { useState, useEffect, useReducer } from "react";
import Axios from "axios"; //make request thru api
import {
  FaFilter,
  FaSortAlphaDown,
  FaSortAlphaDownAlt,
  FaSortNumericDownAlt,
  FaSortNumericDown,
  FaUserTie,
} from "react-icons/fa";
import "../style.css";
import { AiOutlineClose } from "react-icons/ai";
//import CreateUser from "../Shared/Users/CreateUser";
import CreateUser from "../../Users/CreateUser";

const UsersList = () => {
  const initialSort = {
    field: "id",
    isAscSort: undefined,
  };
  const [usersList, setUsersList] = useState([]); //to store data & render in DOM
  const [sortConfig, setSortConfig] = useState(initialSort);
  const [active, setActive] = useState("None");

  // retrive audit logs from DB
  useEffect(() => {
    Axios.get("/users/sel") //fetch api to read files
      .then((res) => {
        if (res.status === 200) {
          setUsersList(res.data[0]);
          //console.log(res.data[0]);
        }
      })
      .catch((err) => {
        console.log("Failed to get audit logs", err);
      });
  }, []);

  // sorting algorithm
  const onSort = (e) => {
    let config = sortConfig;
    let userslist = [...usersList];
    let col = e.target.id;

    if (e.target.type !== "text") {
      // set the column (field) in sort configure
      // if e.target.id is returned from click event, use it as configuration for field/column
      if (col) {
        config.field = col;
      } else {
        // if e.target.id is not pass from click event, then copy from configuration
        config.field = sortConfig.field;
        col = config.field;
      }
      // reverse the Asc/Des icon
      config.isAscSort = !config.isAscSort;
      setSortConfig(config);

      if (col === "id") {
        // int data type sorting
        userslist = userslist.sort((a, b) => a[col] - b[col]);
      } else {
        // string data type sorting
        userslist = userslist.sort((a, b) => a[col].localeCompare(b[col]));
      }

      // if isAscSort is false then reverse the sorting
      if (config.isAscSort === false) {
        userslist.reverse();
      }
    }
    setUsersList(userslist);
  };

  //Handling change when there is changes in textbox for query aka filtering
  const handleChangeValue = (e) => {
    let queryField = e.target.id;
    let queryValue = e.target.value;

    //pass field and value to reducer
    dispatch({ field: queryField, value: queryValue });
  };

  // escape special characters from query string
  const escapeRegExp = (string) => {
    return string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  };

  let userslist = [...usersList];

  // "state" is refer to initial state, where input is the string from user input for filtering
  const filteringReducer = (state, input) => {
    userslist = usersList.filter((item) =>
      item[input.field]
        .toString()
        .toLowerCase()
        .match(escapeRegExp(input.value.toLowerCase()))
    );
    return userslist;
  };

  // useReducer returns an array that holds the current state value
  // the "state" refers to initial state
  const [state, dispatch] = useReducer(filteringReducer, {
    field: "",
    value: "",
  });
  const bgcolor = {
    backgroundColor: "#5ce1e6",
  };

  return (
    <div className="row position-relative">
      <div className="col-12 col-sm-12 col-md-12 col-lg-12 ">
        <div className="panel panel-default p-2 mb-5 bg-white">
          <h4 className="userlist-table-title">Users</h4>

          <button
            className="btn btn-success btn-sm float-right d-flex flex-row-reverse m-2"
            //onclick function to trigger and change the react hook state
            onClick={() => {
              setActive("New User");
            }}
          >
            CREATE USER
          </button>

          {/* Table header*/}
          <table className="table table-condensed table-hover table-responsive">
            <thead className="userview-thead">
              <tr>
                {/** Users ID */}
                <th>
                  <div
                    className="table-header-text header-width-id"
                    id="id"
                    type="button"
                    onClick={(e) => onSort(e)}
                  >
                    ID
                    <div className="btn-group float-right">
                      {sortConfig.field === "id" &&
                        sortConfig.isAscSort === true && (
                          <span>
                            <FaSortNumericDown color="white" />
                          </span>
                        )}
                      {sortConfig.field === "id" &&
                        sortConfig.isAscSort === false && (
                          <span>
                            <FaSortNumericDownAlt color="white" />
                          </span>
                        )}
                      <span
                        type="button"
                        className="btn btn-sm icon"
                        data-toggle="dropdown"
                      >
                        <FaFilter color="white" />
                      </span>
                      <div
                        className="dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0"
                        style={bgcolor}
                      >
                        <input
                          className="form-control-sm sm-1"
                          type="text"
                          id="id"
                          placeholder="search"
                          //call the handle change function
                          onChange={(e) => handleChangeValue(e)}
                          value={dispatch.value}
                        />
                      </div>
                    </div>
                  </div>
                </th>

                {/* Has Account Property */}
                <th>
                  <div className="column-hasacc hasaccount-column">
                    <div id="id" type="button" onClick={(e) => onSort(e)}>
                      <div className="btn-group float-right">
                        {sortConfig.field === "hasaccount" &&
                          sortConfig.isAscSort === true && (
                            <span>
                              <FaSortNumericDown color="white" />
                            </span>
                          )}
                        {sortConfig.field === "hasaccount" &&
                          sortConfig.isAscSort === false && (
                            <span>
                              <FaSortNumericDownAlt color="white" />
                            </span>
                          )}
                        <span
                          type="button"
                          className="btn btn-sm icon"
                          data-toggle="dropdown"
                        >
                          <FaFilter color="white" />
                        </span>
                        <div
                          className="dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0"
                          style={bgcolor}
                        >
                          <input
                            className="form-control-sm sm-1"
                            type="text"
                            id="hasaccount"
                            placeholder="search"
                            //call the handle change function
                            onChange={(e) => handleChangeValue(e)}
                            value={dispatch.value}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </th>

                {/** Users full name */}
                <th>
                  <div
                    className="table-header-text header-width"
                    id="fullname"
                    type="button"
                    onClick={(e) => onSort(e)}
                  >
                    Full Name
                    <div className="btn-group float-right">
                      {sortConfig.field === "fullname" &&
                        sortConfig.isAscSort === true && (
                          <span>
                            <FaSortAlphaDown color="white" />
                          </span>
                        )}
                      {sortConfig.field === "fullname" &&
                        sortConfig.isAscSort === false && (
                          <span>
                            <FaSortAlphaDownAlt color="white" />
                          </span>
                        )}
                      <span
                        type="button"
                        className="btn btn-sm icon"
                        data-toggle="dropdown"
                      >
                        <FaFilter color="white" />
                      </span>
                      <div
                        className="dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0"
                        style={bgcolor}
                      >
                        <input
                          className="form-control-sm sm-1"
                          type="text"
                          id="fullname"
                          placeholder="search"
                          //call the handle change function
                          onChange={(e) => handleChangeValue(e)}
                          value={dispatch.value}
                        />
                      </div>
                    </div>
                  </div>
                </th>

                {/** Users email */}
                <th>
                  <div
                    className="table-header-text header-width"
                    id="email"
                    type="button"
                    onClick={(e) => onSort(e)}
                  >
                    Email
                    <div className="btn-group float-right">
                      {sortConfig.field === "email" &&
                        sortConfig.isAscSort === true && (
                          <span>
                            <FaSortNumericDown color="white" />
                          </span>
                        )}
                      {sortConfig.field === "email" &&
                        sortConfig.isAscSort === false && (
                          <span>
                            <FaSortNumericDownAlt color="white" />
                          </span>
                        )}
                      <span
                        type="button"
                        className="btn btn-sm icon"
                        data-toggle="dropdown"
                      >
                        <FaFilter color="white" />
                      </span>
                      <div
                        className="dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0"
                        style={bgcolor}
                      >
                        <input
                          className="form-control-sm sm-1"
                          type="text"
                          id="email"
                          placeholder="search"
                          //call the handle change function
                          onChange={(e) => handleChangeValue(e)}
                          value={dispatch.value}
                        />
                      </div>
                    </div>
                  </div>
                </th>

                {/** Phone Number */}
                <th>
                  <div
                    className="userslist-column-phoneno"
                    id="phonenumber"
                    type="button"
                    onClick={(e) => onSort(e)}
                  >
                    Phone Number
                    <div className="btn-group float-right">
                      {sortConfig.field === "phonenumber" &&
                        sortConfig.isAscSort === true && (
                          <span>
                            <FaSortAlphaDown color="white" />
                          </span>
                        )}
                      {sortConfig.field === "phonenumber" &&
                        sortConfig.isAscSort === false && (
                          <span>
                            <FaSortAlphaDownAlt color="white" />
                          </span>
                        )}
                      <span
                        type="button"
                        className="btn btn-sm icon"
                        data-toggle="dropdown"
                      >
                        <FaFilter color="white" />
                      </span>
                      <div
                        className="dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0"
                        style={bgcolor}
                      >
                        <input
                          className="form-control-sm sm-1"
                          type="text"
                          id="phonenumber"
                          placeholder="search"
                          //call the handle change function
                          onChange={(e) => handleChangeValue(e)}
                          value={dispatch.value}
                        />
                      </div>
                    </div>
                  </div>
                </th>

                {/** Position */}
                <th>
                  <div
                    className="table-header-text header-width"
                    id="position"
                    type="button"
                    onClick={(e) => onSort(e)}
                  >
                    Position
                    <div className="btn-group float-right">
                      {sortConfig.field === "position" &&
                        sortConfig.isAscSort === true && (
                          <span>
                            <FaSortNumericDown color="white" />
                          </span>
                        )}
                      {sortConfig.field === "position" &&
                        sortConfig.isAscSort === false && (
                          <span>
                            <FaSortNumericDownAlt color="white" />
                          </span>
                        )}
                      <span
                        type="button"
                        className="btn btn-sm icon"
                        data-toggle="dropdown"
                      >
                        <FaFilter color="white" />
                      </span>
                      <div
                        className="dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0"
                        style={bgcolor}
                      >
                        <input
                          className="form-control-sm sm-1"
                          type="text"
                          id="position"
                          placeholder="search"
                          //call the handle change function
                          onChange={(e) => handleChangeValue(e)}
                          value={dispatch.value}
                        />
                      </div>
                    </div>
                  </div>
                </th>

                {/** Primary Skills */}
                <th>
                  <div
                    className="userslist-column-primaryskills"
                    id="primaryskillname"
                    type="button"
                    onClick={(e) => onSort(e)}
                  >
                    Primary Skills
                    <div className="btn-group float-right">
                      {sortConfig.field === "primaryskillname" &&
                        sortConfig.isAscSort === true && (
                          <span>
                            <FaSortAlphaDown color="white" />
                          </span>
                        )}
                      {sortConfig.field === "primaryskillname" &&
                        sortConfig.isAscSort === false && (
                          <span>
                            <FaSortAlphaDownAlt color="white" />
                          </span>
                        )}
                      <span
                        type="button"
                        className="btn btn-sm icon"
                        data-toggle="dropdown"
                      >
                        <FaFilter color="white" />
                      </span>
                      <div
                        className="dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0"
                        style={bgcolor}
                      >
                        <input
                          className="form-control-sm sm-1"
                          type="text"
                          id="primaryskillname"
                          placeholder="search"
                          //call the handle change function
                          onChange={(e) => handleChangeValue(e)}
                          value={dispatch.value}
                        />
                      </div>
                    </div>
                  </div>
                </th>

                {/** Secondary Skills */}
                <th>
                  <div
                    className="userslist-column-secondaryskills"
                    id="secondaryskillname"
                    type="button"
                    onClick={(e) => onSort(e)}
                  >
                    Secondary Skills
                    <div className="btn-group float-right">
                      {sortConfig.field === "secondaryskillname" &&
                        sortConfig.isAscSort === true && (
                          <span>
                            <FaSortAlphaDown color="white" />
                          </span>
                        )}
                      {sortConfig.field === "secondaryskillname" &&
                        sortConfig.isAscSort === false && (
                          <span>
                            <FaSortAlphaDownAlt color="white" />
                          </span>
                        )}
                      <span
                        type="button"
                        className="btn btn-sm icon"
                        data-toggle="dropdown"
                      >
                        <FaFilter color="white" />
                      </span>
                      <div
                        className="dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0"
                        style={bgcolor}
                      >
                        <input
                          className="form-control-sm sm-1"
                          type="text"
                          id="secondaryskillname"
                          placeholder="search"
                          //call the handle change function
                          onChange={(e) => handleChangeValue(e)}
                          value={dispatch.value}
                        />
                      </div>
                    </div>
                  </div>
                </th>

                {/** Daily Rate */}
                <th>
                  {" "}
                  <div className="userslist-column-dailyrate">
                    <div
                      id="dailyrate"
                      type="button"
                      onClick={(e) => onSort(e)}
                    >
                      Daily Rate
                      <div className="btn-group float-right">
                        {sortConfig.field === "dailyrate" &&
                          sortConfig.isAscSort === true && (
                            <span>
                              <FaSortAlphaDown color="white" />
                            </span>
                          )}
                        {sortConfig.field === "dailyrate" &&
                          sortConfig.isAscSort === false && (
                            <span>
                              <FaSortAlphaDownAlt color="white" />
                            </span>
                          )}
                        <span
                          type="button"
                          className="btn btn-sm icon"
                          data-toggle="dropdown"
                        >
                          <FaFilter color="white" />
                        </span>
                        <div
                          className="dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0"
                          style={bgcolor}
                        >
                          <input
                            className="form-control-sm sm-1"
                            type="text"
                            id="dailyrate"
                            placeholder="search"
                            //call the handle change function
                            onChange={(e) => handleChangeValue(e)}
                            value={dispatch.value}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </th>

                {/** Contract Start Date */}
                <th>
                  <div
                    className="userslist-column-contractenddate"
                    id="contractstartdate"
                    type="button"
                    onClick={(e) => onSort(e)}
                  >
                    Date Started
                    <div className="btn-group float-right">
                      {sortConfig.field === "contractstartdate" &&
                        sortConfig.isAscSort === true && (
                          <span>
                            <FaSortAlphaDown color="white" />
                          </span>
                        )}
                      {sortConfig.field === "contractstartdate" &&
                        sortConfig.isAscSort === false && (
                          <span>
                            <FaSortAlphaDownAlt color="white" />
                          </span>
                        )}
                      <span
                        type="button"
                        className="btn btn-sm icon"
                        data-toggle="dropdown"
                      >
                        <FaFilter color="white" />
                      </span>
                      <div
                        className="dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0"
                        style={bgcolor}
                      >
                        <input
                          className="form-control-sm sm-1"
                          type="text"
                          id="contractstartdate"
                          placeholder="search"
                          //call the handle change function
                          onChange={(e) => handleChangeValue(e)}
                          value={dispatch.value}
                        />
                      </div>
                    </div>
                  </div>
                </th>

                {/** Contract End Date */}
                <th>
                  <div
                    className="userslist-column-contractenddate"
                    id="contractenddate"
                    type="button"
                    onClick={(e) => onSort(e)}
                  >
                    Date Ended
                    <div className="btn-group float-right">
                      {sortConfig.field === "contractenddate" &&
                        sortConfig.isAscSort === true && (
                          <span>
                            <FaSortAlphaDown color="white" />
                          </span>
                        )}
                      {sortConfig.field === "contractenddate" &&
                        sortConfig.isAscSort === false && (
                          <span>
                            <FaSortAlphaDownAlt color="white" />
                          </span>
                        )}
                      <span
                        type="button"
                        className="btn btn-sm icon"
                        data-toggle="dropdown"
                      >
                        <FaFilter color="white" />
                      </span>
                      <div
                        className="dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0"
                        style={bgcolor}
                      >
                        <input
                          className="form-control-sm sm-1"
                          type="text"
                          id="contractenddate"
                          placeholder="search"
                          //call the handle change function
                          onChange={(e) => handleChangeValue(e)}
                          value={dispatch.value}
                        />
                      </div>
                    </div>
                  </div>
                </th>

                {/** Date Created */}
                <th>
                  <dic className="userslist-column-dc">
                    <div
                      id="datecreated"
                      type="button"
                      onClick={(e) => onSort(e)}
                    >
                      Date Created
                      <div className="btn-group float-right">
                        {sortConfig.field === "datecreated" &&
                          sortConfig.isAscSort === true && (
                            <span>
                              <FaSortAlphaDown color="white" />
                            </span>
                          )}
                        {sortConfig.field === "datecreated" &&
                          sortConfig.isAscSort === false && (
                            <span>
                              <FaSortAlphaDownAlt color="white" />
                            </span>
                          )}
                        <span
                          type="button"
                          className="btn btn-sm icon"
                          data-toggle="dropdown"
                        >
                          <FaFilter color="white" />
                        </span>
                        <div
                          className="dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0"
                          style={bgcolor}
                        >
                          <input
                            className="form-control-sm sm-1"
                            type="text"
                            id="datecreated"
                            placeholder="search"
                            //call the handle change function
                            onChange={(e) => handleChangeValue(e)}
                            value={dispatch.value}
                          />
                        </div>
                      </div>
                    </div>
                  </dic>
                </th>

                {/** Date Modified */}
                <th>
                  <div className="userslist-column-datemodified">
                    <div
                      id="datemodified"
                      type="button"
                      onClick={(e) => onSort(e)}
                    >
                      Date Modified
                      <div className="btn-group float-right">
                        {sortConfig.field === "datemodified" &&
                          sortConfig.isAscSort === true && (
                            <span>
                              <FaSortAlphaDown color="white" />
                            </span>
                          )}
                        {sortConfig.field === "datemodified" &&
                          sortConfig.isAscSort === false && (
                            <span>
                              <FaSortAlphaDownAlt color="white" />
                            </span>
                          )}
                        <span
                          type="button"
                          className="btn btn-sm icon"
                          data-toggle="dropdown"
                        >
                          <FaFilter color="white" />
                        </span>
                        <div
                          className="dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0"
                          style={bgcolor}
                        >
                          <input
                            className="form-control-sm sm-1"
                            type="text"
                            id="datemodified"
                            placeholder="search"
                            //call the handle change function
                            onChange={(e) => handleChangeValue(e)}
                            value={dispatch.value}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {userslist.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.hasaccount === "TRUE" ? <FaUserTie /> : " "}</td>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="userslist-column-phoneno">
                      {user.phonenumber}
                    </div>
                  </td>
                  <td>{user.position}</td>
                  <td>
                    <div className="userslist-column-primaryskills">
                      {user.primaryskillname}
                    </div>
                  </td>
                  <td>
                    <div className="userslist-column-secondaryskills">
                      {user.secondaryskillname}
                    </div>
                  </td>
                  <td>{user.dailyrate}</td>
                  <td>
                    <div className="userslist-column-contractstartdate">
                      {user.contractstartdate}
                    </div>
                  </td>
                  <td>
                    <div className="userslist-column-contractenddate">
                      {user.contractenddate}
                    </div>
                  </td>
                  <td>
                    <div className="userslist-column-datecreated">
                      {user.datecreated}
                    </div>
                  </td>
                  <td>{user.datemodified}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* conditional rendering based on onClick */}

          <div className="createuser-col-auto">
            {active === "New User" && (
              <div className="userlist-createuser panel shadow bg-white pt-2 pr-1 pl-1 pb-5 mb-2">
                <div className="float-right mt-1 mr-1">
                  <AiOutlineClose
                    type="button"
                    size={25}
                    onClick={() => {
                      setActive("None");
                    }}
                  />
                </div>
                {/* Create User widget in Users List */}
                <CreateUser />
                <div className="createuser-cancel-btn float-left">
                  <button
                    className="btn btn-danger btn-sm"
                    type="button"
                    onClick={() => {
                      setActive("None");
                    }}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
