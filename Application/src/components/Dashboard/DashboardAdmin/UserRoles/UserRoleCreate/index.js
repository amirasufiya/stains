import React, { Component } from "react";
import Axios from "axios";
import GetCurrentLocalDateTime from "../../../../../utils/GetCurrentLocalDateTime";
import Swal from "sweetalert2";
import "./style.css";

const addUserRole = (roleData) => {
  // API call to add roles type to db and error handling
  Axios.post("/lookupuserroles/ins", {
    roleData,
  })
    .catch((err) => {
      console.log(err);
 
    });
};

class UserRoleCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rolename: "",
      userRolesList: [],
    };
  }

  // handle change in namefiled including text and single selection
  changeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  submitHandler = (e) => {
    e.preventDefault();

    //  convert UTC time into our Malaysia local time
    let dateString = GetCurrentLocalDateTime();

    // escape special characters from search string
    const escapeRegExp = (string) => {
      return string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    };

    //map the list of techstack fetched from DB
    let input = this.state.rolename.toUpperCase();
    let result = this.state.userRolesList.map((a) => a.rolename.toUpperCase());
    let matchInfo = result.find((b) =>
      b.match(escapeRegExp(input.slice(0, 3)))
    ); //finding input inside result

    //switch condition
    switch (true) {
      case result.indexOf(input) !== -1:
        Swal.fire({
          title: "<h3>Warning</h3>",
          text: "We are unable to create a new value as we have identified that such user role already exist!",
          confirmButtonColor: "#64717B",
          customClass: {
            title: "text-warning",
          },
        });
        break;

      case result.some((b) => b.includes(input.slice(0, 3))):
        //.some() - to check if elements in the array pass a test
        //.includes() - to check if the string contains a specified string

        Swal.fire({
          title: "<h3>Warning</h3>",
          text:
            "We have found a similar records in the system " +
            "'" +
            matchInfo +
            "'" +
            ". Do you still want to proceed and add a new user role?",
          showCancelButton: true,
          confirmButtonText: "SAVE",
          cancelButtonText: "CANCEL",
          confirmButtonColor: "#218838",
          closeButtonColor: "#00ff00",
          customClass: {
            title: "text-warning",
          },
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            // Save it!
            let roleData = {
              rolename: this.state.rolename,
              datecreated: dateString,
              datemodified: dateString,
            };
            //calling function to insert data into db
            addUserRole(roleData);

            Swal.fire({
              text: "New User Role has been successfully created!",
              icon: "success",
              title: "<h3>CONFIRMATION</h3>",
              confirmButtonColor: "#63707A",
              customClass: {
                title: "text-light",
                htmlContainer: "text-light",
                popup: "bg-success",
              },
            });
          }
        });

        break;

      default:
        Swal.fire({
          title: "Do you want to add " + input + " as new user role?",
          showCancelButton: true,
          confirmButtonText: "SAVE",
          confirmButtonColor: "#218838",
          cancelButtonText: "CANCEL",
          cancelButtonColor: "#63707A",
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            // Save it!
            let roleData = {
              rolename: this.state.rolename,
              datecreated: dateString,
              datemodified: dateString,
            };
            //calling function to insert data into db
            addUserRole(roleData);

            Swal.fire({
              text: "New user role has been successfully created!",
              icon: "success",
              title: "<h3>CONFIRMATION</h3>",
              confirmButtonColor: "#63707A",
              customClass: {
                title: "text-light",
                htmlContainer: "text-light",
                popup: "bg-success",
              },
            });
          }
        });
    }
  };

  // get all user roles in db
  getUserRoles = () => {
    Axios.get("/lookupuserroles")
      .then((res) => {
        if (res.status === 200) {
          let userRolesList = res.data[0];
          this.setState({ userRolesList });
          //console.log(userRolesList);
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("Failed to retrieve, please try again.");
      });
  };

  componentDidMount() {
    this.getUserRoles();
  }

  render() {
    const { rolename } = this.state;

    return (
      <div>
        <form onSubmit={this.submitHandler.bind(this)}>
          <h4 className="roles-create-title">
            Create A New Role
          </h4>
          <p className="roles-create-title">Required fields are marked with *.</p>
          <div className="form-group form-inline form-row">
            <p
              className="roles-name col-sm-4 col-md-4 col-lg-4 text-md-right"
              htmlFor="createUserRole"
            >*Name: </p>
            <input
              type="text"
              className="form-control col-sm-6 col-md-6 col-lg-6"
              id="rolename"
              value={rolename}
              onChange={this.changeHandler}
            />
          </div>
          <div className="roles-create-button form-group float-right">
            <button className="btn btn-success btn-sm" type="submit">
              CREATE
            </button>
          </div>
      </form>
      </div>
    );
  }
}

export default UserRoleCreate;
