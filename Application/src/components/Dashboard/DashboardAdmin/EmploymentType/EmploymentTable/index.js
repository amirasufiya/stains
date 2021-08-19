import React, { useState, useEffect, useReducer } from "react";
import Axios from "axios"; //make request thru api
import NewEmployment from "../NewEmployment";
import {
  FaFilter,
  FaSortAlphaDown,
  FaSortAlphaDownAlt,
  FaSortNumericDownAlt,
  FaSortNumericDown,
} from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

import "../style.css";

const EmploymentList = () => {
  const initialSort = {
    field: "id",
    isAscSort: undefined,
  };

  const [employmentlist, setEmploymentList] = useState([]); //to store data & render in DOM
  const [active, setActive] = useState("None");
  const [sortConfig, setSortConfig] = useState(initialSort);

  useEffect(() => {
    Axios.get("/employment/sel") //Fetch employment type list
      .then((res) => {
        if (res.status === 200) {
          setEmploymentList(res.data[0]);
        }
      })
      .catch((err) => {
        console.log("Failed to fetch employment type list data.", err);
      });
  }, []);

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

  //set the data from api calls to employmentData
  let employmentData = [...employmentlist];

  // "state" is refer to initial state, where input is the string from user input for filtering
  const filteringReducer = (state, input) => {
    employmentData = employmentData.filter((item) =>
      item[input.field]
        .toString()
        .toLowerCase()
        .match(escapeRegExp(input.value.toLowerCase()))
    );
    return employmentData;
  };

  // useReducer returns an array that holds the current state value
  // the "state" refers to initial state
  const [dispatch] = useReducer(filteringReducer, {
    field: "",
    value: "",
  });

  const onSort = (e) => {
    let config = sortConfig;
    let employmentData = [...employmentlist];
    let col = e.target.id;

    if (e.target.type !== "text") {
      // set the column (field) in sort configure
      if (col) {
        config.field = col;
      } else {
        config.field = sortConfig.field;
        col = config.field;
      }
      // reverse the Asc/Des icon
      config.isAscSort = !config.isAscSort;
      setSortConfig(config);

      switch (col) {
        case "id":
          // id is integer
          employmentData = employmentData.sort((a, b) => a[col] - b[col]);
          break;
        default:
          // other columns are string
          employmentData = employmentData.sort((a, b) =>
            a[col].localeCompare(b[col])
          );
          break;
      }

      // if isAscSort is false then reverse the sorting
      if (config.isAscSort === false) {
        employmentData.reverse();
      }
    }
    setEmploymentList(employmentData);
  };

  return (
    <div className="row position-relative">
      <div className="col-12 col-sm-12 col-md-12 col-lg-12 ">
        <div className="panel panel-default p-2 mb-5 bg-white">
          <h4 className="employment-table-title">Employment Types</h4>

          {/* button to add new employment type */}
          <button
            className="btn btn-success btn-sm float-right d-flex flex-row-reverse m-2"
            //onclick function to trigger and change the react hook state
            onClick={() => {
              setActive("Add Employment");
            }}
          >
            CREATE EMPLOYMENT TYPE
          </button>

          <div className="panel-body table-responsive">
            {/* Table header*/}
            <table className="table table-condensed table-hover ">
              <thead className="employment-table-thead">
                <tr>
                  {/* header for id */}
                  <th className="align-middle header-width-id">
                    <div
                      className="table-header-text"
                      id="id"
                      type="button"
                      onClick={(e) => onSort(e)}
                    >
                      ID
                      <div className="btn-group float-right">
                        {sortConfig.field === "id" &&
                          sortConfig.isAscSort === true && (
                            <span>
                              <FaSortNumericDown className="employment-icon" />
                            </span>
                          )}
                        {sortConfig.field === "id" &&
                          sortConfig.isAscSort === false && (
                            <span>
                              <FaSortNumericDownAlt className="employment-icon" />
                            </span>
                          )}
                        <span
                          type="button"
                          className="btn btn-sm icon"
                          data-toggle="dropdown"
                        >
                          <FaFilter className="employment-icon" />
                        </span>
                        <div className="employment-search dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0">
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

                  {/* header for employment type name */}
                  <th className="align-middle header-width">
                    <div
                      className="table-header-text"
                      id="typename"
                      type="button"
                      onClick={(e) => onSort(e)}
                    >
                      Employment Type Name
                      <div className="btn-group float-right">
                        {sortConfig.field === "typename" &&
                          sortConfig.isAscSort === true && (
                            <span>
                              <FaSortAlphaDown className="employment-icon" />
                            </span>
                          )}
                        {sortConfig.field === "typename" &&
                          sortConfig.isAscSort === false && (
                            <span>
                              <FaSortAlphaDownAlt className="employment-icon" />
                            </span>
                          )}
                        <span
                          type="button"
                          className="btn btn-sm icon"
                          data-toggle="dropdown"
                        >
                          <FaFilter className="employment-icon" />
                        </span>
                        <div className="employment-search dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0">
                          <input
                            className="form-control-sm sm-1"
                            type="text"
                            id="typename"
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
                  <th className="align-middle header-width">
                    <div
                      className="table-header-text"
                      id="datecreated"
                      type="button"
                      onClick={(e) => onSort(e)}
                    >
                      Date Created{" "}
                      <div className="btn-group float-right">
                        {sortConfig.field === "datecreated" &&
                          sortConfig.isAscSort === true && (
                            <span>
                              <FaSortNumericDown className="employment-icon" />
                            </span>
                          )}
                        {sortConfig.field === "datecreated" &&
                          sortConfig.isAscSort === false && (
                            <span>
                              <FaSortNumericDownAlt className="employment-icon" />
                            </span>
                          )}

                        <span
                          type="button"
                          className="btn btn-sm icon"
                          data-toggle="dropdown"
                        >
                          <FaFilter className="employment-icon" />
                        </span>
                        <div className="employment-search dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0">
                          <input
                            className="form-control-sm m-1"
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

                  {/** Date Modified */}
                  <th className="align-middle header-width">
                    <div
                      className="table-header-text"
                      id="datemodified"
                      type="button"
                      onClick={(e) => onSort(e)}
                    >
                      Date Modified{" "}
                      <div className="btn-group float-right">
                        {sortConfig.field === "datemodified" &&
                          sortConfig.isAscSort === true && (
                            <span>
                              <FaSortNumericDown className="employment-icon" />
                            </span>
                          )}
                        {sortConfig.field === "datemodified" &&
                          sortConfig.isAscSort === false && (
                            <span>
                              <FaSortNumericDownAlt
                                className="employment-icon"
                                disabled={true}
                              />
                            </span>
                          )}
                        <span
                          type="button"
                          className="btn btn-sm icon"
                          data-toggle="dropdown"
                        >
                          <FaFilter className="employment-icon" />
                        </span>
                        <div className="employment-search dropdown-menu dropdown-menu-right mt-0 border-0 rounded-0">
                          <input
                            className="form-control-sm m-1"
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
                </tr>
              </thead>

              {/* Main content for the table */}

              <tbody>
                {employmentData.map(
                  (
                    val,
                    key //mapping for employment type
                  ) => {
                    return (
                      <>
                        <tr key={key}>
                          <td>{val.id}</td>
                          <td>{val.typename}</td>
                          <td>{val.datecreated}</td>
                          <td>{val.datemodified}</td>
                        </tr>
                      </>
                    );
                  }
                )}
                {/* end of mapping for employment type */}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Onclick conditional rendering */}
      <div className="employment-col-auto" id="employment-pop">
        {active === "None"}
        {active === "Add Employment" && (
          <div className="employment-createnew panel panel-default bg-white shadow pt-2 pr-1 pl-1 pb-5">
            <div className="col">
              <div className="float-right mt-1 mr-1">
                <AiOutlineClose
                  type="button"
                  size={25}
                  onClick={() => {
                    setActive("None");
                  }}
                />
              </div>
              <NewEmployment />
              <div className="employment-cancel-btn float-left">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default EmploymentList;
