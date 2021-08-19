import React, { Component } from "react";
import { Link } from "react-router-dom";

import UsersNotLoggedIn from "./UsersNotLoggedIn";
import PageView from "./PageView";
import UsersAdministration from "./UsersAdministration";
import NavHorizontal from "../../Layout/Navigation/navhorizontal";
import NavVertical from "../../Layout/Navigation/navvertical";

import "./style.css";

//This the component for admin dashboard, which is intended to call each widget components
class AdminDashboard extends Component {
  render() {
    const { isAuthenticated, login } = this.props.auth;

    return (
      <div className="">
        {/* top navigation  */}
        <NavHorizontal />
        {/* side navigation*/}
        <div className="row">
          {/*dashboard content  */}
          {isAuthenticated() ? (
            <div className="container-fluid">
              {/* Dashboard component call begin from here */}
              <div className="d-flex h-100">
                <div className="">
                  <NavVertical />
                </div>

                <div className="container-fluid">
                  <div className="admin-content">
                    <div className="row">
                      <div className="useradmin-div col-sm-12 col-md-12 col-lg-12">
                        <div className="card">
                          <UsersAdministration />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                    <div className="pageview-div col-sm-7 col-md-7 col-lg-7">
                        <div className="card">
                          <PageView />
                        </div>
                      </div>
                      <div className="notloggedin-div col-sm-5 col-md-5 col-lg-5">
                        <div className="card">
                          <UsersNotLoggedIn />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* Dashboard component call Form end here */}
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

export default AdminDashboard;
