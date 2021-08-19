import React, { useState, useEffect, useReducer } from "react";
import Axios from "axios"; //make request thru api
import {
  FaFilter,
  FaSortAlphaDown,
  FaSortAlphaDownAlt,
  FaSortNumericDownAlt,
  FaSortNumericDown,
} from "react-icons/fa";
import "../style.css";
import { AiOutlineClose } from "react-icons/ai";
import NewAppDetail from "../../CreateApplication/createapp";
import UpdateApp from "../AppsUpdate/index";

const AppsList = () => {
  const initialSort = {
    field: "id",
    isAscSort: undefined,
  };
  const [appsList, setAppsList] = useState([]); //to store data & render in DOM
  const [sortConfig, setSortConfig] = useState(initialSort);
  const [active, setActive] = useState("None");
  const [appId, setAppId] = useState(0);

  // retrive audit logs from DB
  useEffect(() => {
    Axios.get("/applications/sel") //fetch api to read files
      .then((res) => {
        if (res.status === 200) {
          setAppsList(res.data[0]);
          // console.log(res.data[0]);
        }
      })
      .catch((err) => {
        console.log("Failed to get audit logs", err);
      });
  }, []);

  // sorting algorithm
  const onSort = (e) => {
    let config = sortConfig;
    let appsdetail = [...appsList];
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

      if (col === "id" || col === "expectedappmembercount") {
        // int data type sorting
        appsdetail = appsdetail.sort((a, b) => a[col] - b[col]);
      } else {
        // string data type sorting
        appsdetail = appsdetail.sort((a, b) => a[col].localeCompare(b[col]));
      }

      // if isAscSort is false then reverse the sorting
      if (config.isAscSort === false) {
        appsdetail.reverse();
      }
    }
    setAppsList(appsdetail);
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

  let appsdetail = [...appsList];

  // "state" is refer to initial state, where input is the string from user input for filtering
  const filteringReducer = (state, input) => {
    appsdetail = appsList.filter((item) =>
      item[input.field]
        .toString()
        .toLowerCase()
        .match(escapeRegExp(input.value.toLowerCase()))
    );
    return appsdetail;
  };

  // useReducer returns an array that holds the current state value
  // the "state" refers to initial state
  const [dispatch] = useReducer(filteringReducer, {
    field: "",
    value: "",
  });

  const updateAppHandler = (appid) => {
    setAppId(appid)
    setActive("update")
  }

  return (
    <div className="row position-relative">
      <div className="col-12 col-sm-12 col-md-12 col-lg-12">
        <div className="panel panel-default p-2 bg-white">
          <h4 className="applist-table-title">Applications</h4>
          {/* button to add new app */}
          <button
            className="btn btn-success btn-sm float-right d-flex flex-row-reverse m-2"
            //onclick function to trigger and change the react hook state
            onClick={() => {
              setActive("New App");
            }}
          >
            CREATE APP
          </button>

          <div className="panel-body table-responsive">
            {/* Table header*/}
            <table className="table table-condensed table-hover table-responsive">
              <thead className="applist-table-thead">
                <tr>
                  {/** Application ID */}
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
                              <FaSortNumericDown className="applist-icon" />
                            </span>
                          )}
                        {sortConfig.field === "id" &&
                          sortConfig.isAscSort === false && (
                            <span>
                              <FaSortNumericDownAlt className="applist-icon" />
                            </span>
                          )}
                        <span
                          type="button"
                          className="btn btn-sm icon"
                          data-toggle="dropdown"
                        >
                          <FaFilter className="applist-icon" />
                        </span>
                        <div className="applist-search dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0">
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

                  {/** App Name */}
                  <th>
                    <div
                      className="table-header-text header-width"
                      id="appname"
                      type="button"
                      onClick={(e) => onSort(e)}
                    >
                      App Name
                      <div className="btn-group float-right">
                        {sortConfig.field === "appname" &&
                          sortConfig.isAscSort === true && (
                            <span>
                              <FaSortAlphaDown className="applist-icon" />
                            </span>
                          )}
                        {sortConfig.field === "appname" &&
                          sortConfig.isAscSort === false && (
                            <span>
                              <FaSortAlphaDownAlt className="applist-icon" />
                            </span>
                          )}
                        <span
                          type="button"
                          className="btn btn-sm icon"
                          data-toggle="dropdown"
                        >
                          <FaFilter className="applist-icon" />
                        </span>
                        <div className="applist-search dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0">
                          <input
                            className="form-control-sm sm-1"
                            type="text"
                            id="appname"
                            placeholder="search"
                            //call the handle change function
                            onChange={(e) => handleChangeValue(e)}
                            value={dispatch.value}
                          />
                        </div>
                      </div>
                    </div>
                  </th>

                  {/** App URL */}
                  <th>
                    <div
                      className="table-header-text header-width"
                      id="appurl"
                      type="button"
                      onClick={(e) => onSort(e)}
                    >
                      URL
                      <div className="btn-group float-right">
                        {sortConfig.field === "appurl" &&
                          sortConfig.isAscSort === true && (
                            <span>
                              <FaSortAlphaDown className="applist-icon" />
                            </span>
                          )}
                        {sortConfig.field === "appurl" &&
                          sortConfig.isAscSort === false && (
                            <span>
                              <FaSortAlphaDownAlt className="applist-icon" />
                            </span>
                          )}
                        <span
                          type="button"
                          className="btn btn-sm icon"
                          data-toggle="dropdown"
                        >
                          <FaFilter color="white" />
                        </span>
                        <div className="applist-search dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0">
                          <input
                            className="form-control-sm sm-1"
                            type="text"
                            id="appurl"
                            placeholder="search"
                            //call the handle change function
                            onChange={(e) => handleChangeValue(e)}
                            value={dispatch.value}
                          />
                        </div>
                      </div>
                    </div>
                  </th>

                  {/** DevOps URL */}
                  <th>
                    <div
                      className="applist-column-devops"
                      id="devopslink"
                      type="button"
                      onClick={(e) => onSort(e)}
                    >
                      DevOps URL
                      <div className="btn-group float-right">
                        {sortConfig.field === "devopslink" &&
                          sortConfig.isAscSort === true && (
                            <span>
                              <FaSortNumericDown className="applist-icon" />
                            </span>
                          )}
                        {sortConfig.field === "devopslink" &&
                          sortConfig.isAscSort === false && (
                            <span>
                              <FaSortNumericDownAlt className="applist-icon" />
                            </span>
                          )}
                        <span
                          type="button"
                          className="btn btn-sm icon"
                          data-toggle="dropdown"
                        >
                          <FaFilter color="white" />
                        </span>
                        <div className="applist-search dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0">
                          <input
                            className="form-control-sm sm-1"
                            type="text"
                            id="devopslink"
                            placeholder="search"
                            //call the handle change function
                            onChange={(e) => handleChangeValue(e)}
                            value={dispatch.value}
                          />
                        </div>
                      </div>
                    </div>
                  </th>

                  {/** Tech Stack */}
                  <th>
                    <div
                      className="applist-column-techstack"
                      id="techstack"
                      type="button"
                      onClick={(e) => onSort(e)}
                    >
                      Tech Stacks
                      <div className="btn-group float-right">
                        {sortConfig.field === "techstack" &&
                          sortConfig.isAscSort === true && (
                            <span>
                              <FaSortAlphaDown className="applist-icon" />
                            </span>
                          )}
                        {sortConfig.field === "techstack" &&
                          sortConfig.isAscSort === false && (
                            <span>
                              <FaSortAlphaDownAlt className="applist-icon" />
                            </span>
                          )}
                        <span
                          type="button"
                          className="btn btn-sm icon"
                          data-toggle="dropdown"
                        >
                          <FaFilter className="applist-icon" />
                        </span>
                        <div className="applist-search dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0">
                          <input
                            className="form-control-sm sm-1"
                            type="text"
                            id="techstack"
                            placeholder="search"
                            //call the handle change function
                            onChange={(e) => handleChangeValue(e)}
                            value={dispatch.value}
                          />
                        </div>
                      </div>
                    </div>
                  </th>

                  {/** Expected App member count */}
                  <th>
                    <div
                      className="applist-column-member"
                      id="expectedappmembercount"
                      type="button"
                      onClick={(e) => onSort(e)}
                    >
                      #Members
                      <div className="btn-group float-right">
                        {sortConfig.field === "expectedappmembercount" &&
                          sortConfig.isAscSort === true && (
                            <span>
                              <FaSortNumericDown className="applist-icon" />
                            </span>
                          )}
                        {sortConfig.field === "expectedappmembercount" &&
                          sortConfig.isAscSort === false && (
                            <span>
                              <FaSortNumericDownAlt className="applist-icon" />
                            </span>
                          )}
                        <span
                          type="button"
                          className="btn btn-sm icon"
                          data-toggle="dropdown"
                        >
                          <FaFilter className="applist-icon" />
                        </span>
                        <div className="applist-search dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0">
                          <input
                            className="form-control-sm sm-1"
                            type="text"
                            id="expectedappmembercount"
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
                    <div
                      className="applist-column-datecreated"
                      id="datecreated"
                      type="button"
                      onClick={(e) => onSort(e)}
                    >
                      Date Created
                      <div className="btn-group float-right">
                        {sortConfig.field === "datecreated" &&
                          sortConfig.isAscSort === true && (
                            <span>
                              <FaSortAlphaDown className="applist-icon" />
                            </span>
                          )}
                        {sortConfig.field === "datecreated" &&
                          sortConfig.isAscSort === false && (
                            <span>
                              <FaSortAlphaDownAlt className="applist-icon" />
                            </span>
                          )}
                        <span
                          type="button"
                          className="btn btn-sm icon"
                          data-toggle="dropdown"
                        >
                          <FaFilter color="white" />
                        </span>
                        <div className="applist-search dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0">
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
                  </th>

                  {/** Original Value */}
                  <th>
                    <div
                      className="applist-column-datemodified"
                      id="datemodified"
                      type="button"
                      onClick={(e) => onSort(e)}
                    >
                      Date Modified
                      <div className="btn-group float-right">
                        {sortConfig.field === "datemodified" &&
                          sortConfig.isAscSort === true && (
                            <span>
                              <FaSortAlphaDown className="applist-icon" />
                            </span>
                          )}
                        {sortConfig.field === "datemodified" &&
                          sortConfig.isAscSort === false && (
                            <span>
                              <FaSortAlphaDownAlt className="applist-icon" />
                            </span>
                          )}
                        <span
                          type="button"
                          className="btn btn-sm icon"
                          data-toggle="dropdown"
                        >
                          <FaFilter color="white" />
                        </span>
                        <div className="applist-search dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0">
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
                  </th>

                  {/** Comments */}
                  <th>
                    <div
                      className="table-header-text header-width"
                      id="comments"
                      type="button"
                      onClick={(e) => onSort(e)}
                    >
                      Comments
                      <div className="btn-group float-right">
                        {sortConfig.field === "comments" &&
                          sortConfig.isAscSort === true && (
                            <span>
                              <FaSortAlphaDown className="applist-icon" />
                            </span>
                          )}
                        {sortConfig.field === "comments" &&
                          sortConfig.isAscSort === false && (
                            <span>
                              <FaSortAlphaDownAlt className="applist-icon" />
                            </span>
                          )}
                        <span
                          type="button"
                          className="btn btn-sm icon"
                          data-toggle="dropdown"
                        >
                          <FaFilter color="white" />
                        </span>
                        <div className="applist-search dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0">
                          <input
                            className="form-control-sm sm-1"
                            type="text"
                            id="comments"
                            placeholder="search"
                            //call the handle change function
                            onChange={(e) => handleChangeValue(e)}
                            value={dispatch.value}
                          />
                        </div>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {appsdetail.map((app) => (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>
                      <div className="applist-column-appname" onClick={() => updateAppHandler(app.id)}>
                        {app.appname}
                      </div>
                    </td>
                    <td>{app.appurl}</td>
                    <td>
                      <div className="applist-column-devops">
                        {app.devopslink}
                      </div>
                    </td>
                    <td>
                      <div className="applist-column-techstack">
                        {app.techstack}
                      </div>
                    </td>
                    <td>
                      <div className="applist-column-member">
                        {app.expectedappmembercount}
                      </div>
                    </td>
                    <td>
                      <div className="applist-column-datecreated">
                        {app.datecreated}
                      </div>
                    </td>
                    <td>
                      <div className="applist-column-datemodified">
                        {app.datemodified}
                      </div>
                    </td>
                    <td>{app.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* conditional rendering based on onClick */}

      <div className="applist-pop-col-auto" id="applist-pop">
        {active !== "None" && (
          <div className="applist-pop-panel shadow bg-white pt-2 pr-1 pl-1 pb-5">
            <div className="float-right mt-1 mr-1">
              <AiOutlineClose
                type="button"
                size={25}
                onClick={() => {
                  setActive("None");
                  //setIsOverlay("None");
                }}
              />
            </div>
            {active === "New App" && <NewAppDetail />}
            {active === "update" && <UpdateApp />}
            <div className="createapp-cancel-btn float-left">
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
        {/* Update App */}
        {/* {active === "update" && (
          <div className="applist-updateapp panel shadow bg-white pt-2 pr-1 pl-1 pb-5">
            <div className="float-right mt-1 mr-1">
              <AiOutlineClose
                type="button"
                size={25}
                onClick={() => {
                  setActive("None");
                }}
              />
            </div>
            <UpdateApp />
            <div className="updateapp-cancel-btn float-left">
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
        )} */}
      </div>
    </div>
  );
};

export default AppsList;
