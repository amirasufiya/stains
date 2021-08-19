import React, { Component } from "react";
import Axios from "axios";
import "../style.css";
import GetCurrentLocalDateTime from "../../../../utils/GetCurrentLocalDateTime";
class NewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appid: this.props.appid,
      userid: this.props.userid,
      assignedUsers: [],
      unassignedUsers: [],
      usersToAssign: [],
      // defaultStartDate: GetCurrentLocalDateTime(),
      // defaultEndDate: "",
    };
  }
  getAssignedUsers = () => {
    Axios.get("/appsusers/sel")
      .then((res) => {
        if (res.status === 200) {
          let appsusers = res.data[0];
          // filter assgined app with the particular app id passed from props
          let userApp = appsusers.filter(
            (user) => user.appid === this.state.appid
          );
          // map assigned users' id into array
          let assignedUsersList = userApp.map((user) => user.userid);
          this.setState({ assignedUsers: assignedUsersList });
        }
      })
      .catch((err) => {
        console.log("Failed to get user assigned app id", err);
      });
  };

  getUnassignedUsers = () => {
    Axios.get("/users/sel")
      .then((res) => {
        if (res.status === 200) {
          // get new (unassigned) users by filtering assigned users based on appid
          let users = res.data[0];
          let unassignedUsersList = users.filter(
            (user) => !this.state.assignedUsers.includes(user.id)
          );
          unassignedUsersList.forEach((user) => {
            user.engagementstartdate = GetCurrentLocalDateTime().slice(0, 10);
            user.engagementenddate = user.contractenddate;
          });
          this.setState({ unassignedUsers: unassignedUsersList });
          console.log(unassignedUsersList);
        }
      })
      .catch((err) => {
        console.log("Failed to get apps not currently assigned to user", err);
      });
  };

  insertAppUser = (appuser) => {
    Axios.post("/appsusers/ins", {
      appuser,
    })
      .then((res) => {
        if (res.status === 200) {
          //console.log("Successful assigning new users to user");
        }
      })
      .catch((err) => {
        console.log("Failed to assign app", err);
      });
  };

  componentDidMount() {
    this.getAssignedUsers();
    this.getUnassignedUsers();
  }

  checkboxHandler = (e, userId) => {
    let isChecked = e.target.checked;

    let user = {
      id: userId,
      startdate: null,
      enddate: null,
    };

    let users = [...this.state.usersToAssign];
    let userIndex = users.findIndex((user) => user.id === userId);
    if (isChecked === true && userIndex === -1) {
      users.push(user);
    } else if (isChecked === false && userIndex > -1) {
      users.splice(userIndex, 1);
    }

    this.setState({ usersToAssign: users });
  };
  changeHandler = (e, userId) => {
    let users = [...this.state.usersToAssign];
    let userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex > -1 && e.target.id === "startDate") {
      users[userIndex].engagementstartdate = e.target.value;
    } else if (userIndex > -1 && e.target.id === "endDate") {
      users[userIndex].engagementenddate = e.target.value;
    }
    this.setState({ usersToAssign: users });
    console.log("users", users);
  };

  submitHandler = (e) => {
    e.preventDefault();

    let users = [...this.state.usersToAssign];

    let availableUsers = [...this.state.unassignedUsers];

    users.forEach((user) => {
      let appuser = {
        appid: parseInt(this.state.appid),
        userid: user.id,
        startdate: user.engagementstartdate,
        enddate: user.engagementenddate,
      };
      // send request to API
      this.insertAppUser(appuser);
      console.log("User: ", users);
      // remove the app object from the copied array with matching appid as the userid being send to API
      availableUsers = availableUsers.filter(
        (user) => user.id !== appuser.userid
      );
    });
    this.setState({ unassignedUsers: availableUsers });
  };

  isAppChecked = (userId) => {
    let index = this.state.usersToAssign.findIndex(
      (user) => user.id === userId
    );

    if (index !== -1) {
      return false;
    }
    return true;
  };

  render() {
    const { unassignedUsers } = this.state;
    return (
      <div>
        <form
          id="assignUsers"
          onSubmit={this.submitHandler.bind(this)}
          className="newuser"
        >
          <h4 className="text-center">Assign New User</h4>
          <table className="table table-hover table-sm">
            <thead className="thead-light">
              <tr>
                <th>Assign</th>
                <th>Full Name</th>
                <th>Skills</th>
                <th className="p-2">Start Date</th>
                <th className="p-2">End Date</th>
              </tr>
            </thead>
            <tbody>
              {unassignedUsers.map((user, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      id="isAssigned"
                      onChange={(e) => this.checkboxHandler(e, user.id)}
                    />
                  </td>
                  <td>{user.firstname + " " + user.lastname}</td>
                  <td>
                    {user.primaryskillname + "," + user.secondaryskillname}
                  </td>
                  <td>
                    <input
                      type="date"
                      className="form-control"
                      id="startDate"
                      value={user.engagementstartdate}
                      onChange={(e) => this.changeHandler(e, user.id)}
                      disabled={this.isAppChecked(user.id)}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      className="form-control"
                      placeholder={user.contractenddate}
                      id="endDate"
                      value={user.engagementenddate}
                      onChange={(e) => this.changeHandler(e, user.id)}
                      disabled={this.isAppChecked(user.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="form-group float-right">
            <button type="submit" className="btn btn-success AssignApps mr-1">
              ASSIGN USER
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default NewUser;
