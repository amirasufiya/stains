import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import NewAppDetail from "./createapp";
import NavVertical from "../../Layout/Navigation/navvertical";
import NavHorizontal from "../../Layout/Navigation/navhorizontal";

class CreateApp extends Component {
  render() {
    const { isAuthenticated, login } = this.props.auth;

    return (
      <div className="container-fluid main-wrapper">
        <NavHorizontal />

        <div className="row vh-100 ">
          {isAuthenticated() ? (
            <div className="container-fluid">
              {/* Newappdetail component call begin from here */}

              <div className="row">
                <NavVertical />

                <div className="col-sm-10">
                  <NewAppDetail />
                </div>
              </div>
            </div>
          ) : (
            <div className="col-md bgcolor">
              Please{" "}
              <Link to="/" onClick={login}>
                Sign In/Up
              </Link>{" "}
              to continue
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default CreateApp;
