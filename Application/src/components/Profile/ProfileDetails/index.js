import React, { Component } from "react";

import Axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";

import IsProfileCompleted from "../../../utils/IsProfileCompleted";
import GetCurrentLocalDateTime from "../../../utils/GetCurrentLocalDateTime";

import "./style.css";

const updateUserProfile = (user) => {
  // update user's profile
  Axios.post("/users/upd", {
    user,
  })
    .then((res) => {
      if (res.status === 200) {
        Swal.fire({
          title: "<h3>Update Success</h3>",
          text: "Your profile has been updated.",
        }).then((result) => {
          // redirect to home page after clicked 'OK' button
          if (result.isConfirmed) {
            window.location.href = "/home";
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      alert("Failed to update, please try again.");
    });
};

const deleteUserTechStacks = (email) => {
  Axios.delete("/userstechstacks/del", {
    data: {
      email: email,
    },
  })
    .then((res) => {
      if (res.status === 200) {
        //console.log("Delete user's techstacks Succesful");
      }
    })
    .catch((err) => {
      console.log("Failed to delete user's techstacks", err);
    });
};

const insertUserTechStacks = (userTechStacks) => {
  Axios.post("/userstechstacks/ins", {
    userTechStacks,
  })
    .then((res) => {
      if (res.status === 200) {
        //console.log("Insert user's techstacks Successful.");
      }
    })
    .catch((err) => {
      console.log("Failed to insert, please try again.", err);
    });
};

const insAuditLog = (auditlog) => {
  Axios.post("/auditlogs/ins", {
    auditlog,
  })
    .then((res) => {
      if (res.status === 200) {
        console.log("insert audit log successful");
      }
    })
    .catch((err) => {
      console.log("failed to insert audit tracking", err);
    });
};

class ProfileDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //profile: null,
      email: this.props.email,
      picture: this.props.picture,
      modifier: this.props.modifier,
      error: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      employmentType: 0,
      position: "",
      contractStartDate: "",
      contractEndDate: "",
      dailyRate: "",
      primarySkills: [],
      secondarySkills: [],
      datecreated: "",
      datemodified: "",
      employmentTypeList: [],
      techStackList: [],
      snapshot: [],
      toHome: false,
    };
  }

  // get user profile data from db
  getUserProfile = (email) => {
    Axios.post("/profile/sel", {
      email,
    })
      .then((res) => {
        if (res.status === 200) {
          const user = res.data[0][0];

          this.setState({ firstName: user.firstname });
          this.setState({ lastName: user.lastname });
          this.setState({ phoneNumber: user.phonenumber });
          this.setState({
            employmentType: user.employmenttypeid ? user.employmenttypeid : 1,
          }); // if user's employment type is null then set as 1 (permanent)
          this.setState({ position: user.position });
          this.setState({ contractStartDate: user.contractstartdate });
          this.setState({ contractEndDate: user.contractenddate });
          this.setState({ dailyRate: user.dailyrate });

          let snapshot = {
            firstName: user.firstname,
            lastName: user.lastname,
            phoneNumber: user.phonenumber,
            email: user.email,
            employmentType: parseInt(user.employmenttypeid),
            position: user.position,
            contractStartDate: user.contractstartdate,
            contractEndDate: user.contractEndDate,
            dailyRate: user.dailyrate,
          };
          this.setState({ snapshot: snapshot });
        }
      })
      .catch((err) => {
        console.log(
          "No record of user profile is found, please try again.",
          err
        );
      });
  };

  getUserTechStacks = (email) => {
    Axios.post("/userstechstacks/sel", {
      email,
    })
      .then((res) => {
        if (res.status === 200) {
          //console.log("Retrieve user's techstacks Succesful");

          let usersTechStacks = res.data[0].map((obj) => {
            let newObj = {};
            newObj["techstackid"] = obj.techstackid;
            newObj["skilllevel"] = obj.skilllevel;
            return newObj;
          });

          let primarySkillList = usersTechStacks
            .filter((usersTechStacks) => usersTechStacks.skilllevel === 1)
            .map((primarySkills) => primarySkills.techstackid);

          let secondarySkillList = usersTechStacks
            .filter((usersTechStacks) => usersTechStacks.skilllevel === 2)
            .map((secondarySkills) => secondarySkills.techstackid);

          this.setState({ primarySkills: primarySkillList });
          this.setState({ secondarySkills: secondarySkillList });

          let snapshot = this.state.snapshot;
          snapshot.pskills = primarySkillList.sort();
          snapshot.sskills = secondarySkillList.sort();
          this.setState({ snapshot: snapshot });
        }
      })
      .catch((err) => {
        console.log("Failed to retrieve user's techstacks", err);
      });
  };

  // get all tech stacks from DB
  getTechStacks = () => {
    Axios.get("/techstacks/sel")
      .then((res) => {
        if (res.status === 200) {
          // console.log("Get Tech Stack List Successful");
          // format the returned data and create new array of object with two property: values, label for react-select
          let techStackListFormatted = res.data[0]
            .map((stack) => {
              let newObj = {};
              newObj["value"] = stack.id;
              newObj["label"] = stack.techname;
              return newObj;
            })
            .filter((stack) => stack["label"] !== "System Administration"); // remove the object with label as System Administration
          // localeCompare sort the techstack in alphabetical order based on label name
          techStackListFormatted = techStackListFormatted.sort((a, b) =>
            a.label.localeCompare(b.label)
          );
          this.setState({ techStackList: techStackListFormatted });
        }
      })
      .catch((err) => {
        console.log(
          "Failed to get tech stack list, check your code again.",
          err
        );
      });
  };

  // get all employment types from DB
  getEmploymentTypes = () => {
    Axios.get("/employment/sel")
      .then((res) => {
        if (res.status === 200) {
          // change each employment type object properties to value (type id) and label (type name)
          let employmentTypes = res.data[0].map((type) => {
            let newObj = {};
            newObj["value"] = type.id;
            newObj["label"] = type.typename;
            return newObj;
          });

          this.setState({ employmentTypeList: employmentTypes });
        }
      })
      .catch((err) => {
        console.log("Failed to retriev employment types", err);
      });
  };

  // handle change in namefiled including text and single selection
  changeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  // name refers to primary or secondary skills, value is the selected skills. (double arrow function)
  multiSelectHandler = (name) => (value) => {
    value = Array.isArray(value)
      ? value.map((techStackList) => techStackList.value)
      : []; // map the returned selected skills from object to array
    this.setState({
      [name]: value,
    });
  };

  // for employment type dropdown select
  dropdownSelectHandler = (field) => (option) => {
    // field is the name of option in string, option is object contains the value and label
    this.setState({ [field]: option.value });
  };

  // fire request once the "save" button is clicked
  submitHandler = (e) => {
    e.preventDefault();

    //Get timestamp, convert UTC time into our Malaysia local time
    let dateString = GetCurrentLocalDateTime();

    // returned date doesnt require formatting because dateString: true was set in DB
    let user = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phoneNumber: this.state.phoneNumber,
      email: this.state.email,
      employmentType: parseInt(this.state.employmentType),
      position: this.state.position,
      contractStartDate: this.state.contractStartDate
        ? this.state.contractStartDate
        : null,
      contractEndDate: this.state.contractEndDate
        ? this.state.contractEndDate
        : null,
      dailyRate: this.state.dailyRate,
    };
    // update rows in user table only
    updateUserProfile(user);

    let userTechStacks = {
      email: user.email,
      techstackid: 0,
      skilllevel: 0,
      datecreated: dateString,
      datemodified: dateString,
    };

    deleteUserTechStacks(user.email);

    // loop through primary skills and fire request for each selected stack
    const primarySkillsArray = this.state.primarySkills.map(Number);
    for (let x of primarySkillsArray) {
      userTechStacks.techstackid = x;
      userTechStacks.skilllevel = 1;
      insertUserTechStacks(userTechStacks);
    }

    // loop through secondary skills and fire request for each selected stack
    const secondarySkillsArray = this.state.secondarySkills.map(Number);
    for (let x of secondarySkillsArray) {
      userTechStacks.techstackid = x;
      userTechStacks.skilllevel = 2;
      insertUserTechStacks(userTechStacks);
    }

    let keys = Object.keys(user);
    let snapshot = this.state.snapshot;

    // check all user data except primary & secondary skills
    keys.forEach((key, index) => {
      if (
        snapshot[key] !== user[key] ||
        snapshot.firstName === null ||
        snapshot.lastName === null
      ) {
        let auditlog = {
          modifier: this.state.modifier,
          target: this.state.email,
          datecreated: dateString,
        };

        // if the origin value is null, undefined or empty
        if (
          snapshot[key] === null ||
          !snapshot[key] ||
          snapshot[key] === undefined
        ) {
          // action = added
          auditlog.action = 1;
        }
        // if the new value is null, undefined or empty
        else if (user[key] === null || !user[key] || user[key] === undefined) {
          // action = removed
          auditlog.action = 3;
        }
        // if neither original or new value is null, undefined or empty
        else {
          // action = changed
          auditlog.action = 2;
        }

        // field that has been changed, TBH with lookupauditlogobjects table
        switch (key) {
          case "firstName":
            auditlog.object = 3;
            break;
          case "lastName":
            auditlog.object = 4;
            break;
          case "position":
            auditlog.object = 5;
            break;
          case "employmentType":
            auditlog.object = 6;
            break;
          case "phoneNumber":
            auditlog.object = 7;
            break;
          case "contractStartDate":
            auditlog.object = 8;
            break;
          case "contractEndDate":
            auditlog.object = 9;
            break;
          case "dailyRate":
            auditlog.object = 10;
            break;
          default:
        }
        // original value for the field
        auditlog.valueorigin = snapshot[key];
        // new value for the field
        auditlog.valuenew = user[key];
        // insert audit record into auditlogs table
        insAuditLog(auditlog);

        // the new value will become old value right now
        snapshot[key] = user[key];
        this.setState(snapshot);
      }
    });

    // call imported function to check whether profile is completed
    IsProfileCompleted(this.state.modifier);
  };

  componentDidMount() {
    this.getUserProfile(this.state.email);
    this.getUserTechStacks(this.state.email);
    this.getTechStacks();
    this.getEmploymentTypes();
  }

  // filter user's primary and secondary skills to set default value for skills selection part
  findDefaultValue = (skillArray) => {
    let defaultValue = [];
    for (let i = 0; i < skillArray.length; i++) {
      // add object to array when filtering matching techstackid in techStackList
      let item = this.state.techStackList.filter(
        (x) => x.value === skillArray[i]
      );
      defaultValue.push(item[0]);
    }
    return defaultValue;
  };

  render() {
    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      employmentType,
      position,
      contractStartDate,
      contractEndDate,
      dailyRate,
      primarySkills,
      secondarySkills,
      techStackList,
      employmentTypeList,
    } = this.state;

    return (
      <div className="col-12 col-sm-12 col-md-12 col-lg-12">
        {/* Form begin from here */}
        <form
          id="userProfileForm"
          onSubmit={this.submitHandler}
          className="col-sm-12 col-md-12 col-lg-12 mt-2"
        >
          <div className="profile-title row">User Profile</div>

          <div className="row">
            {/* profile picture */}
            <div className="col-sm-2 col-md-2 col-lg-2">
              <img className="avatarpicture" src={this.state.picture} alt="" />
            </div>

            {/* Second column */}
            <div className="col-sm-5 col-md-5 col-lg-5">
              {/* email */}

              <div className="form-group form-inline form-row profile">
                <div
                  className="col-sm-4 col-md-4 col-lg-4 col-form-label"
                  htmlFor="email"
                >
                  E-mail:
                </div>
                <input
                  type="text"
                  readOnly
                  className="form-control col-sm-8 col-md-8 col-lg-8"
                  placeholder="Email Address"
                  id="email"
                  value={email}
                />
              </div>
              {/* first name */}
              <div className="form-group form-inline form-row profile">
                <div
                  className="col-sm-4 col-md-4 col-lg-4 col-form-label"
                  htmlFor="firstName"
                >
                  First Name:
                </div>
                <input
                  type="text"
                  className="form-control col-sm-8 col-md-8 col-lg-8"
                  placeholder="Enter first name"
                  id="firstName"
                  value={firstName}
                  onChange={this.changeHandler}
                />
              </div>

              {/* last name */}

              <div className="form-group form-inline form-row profile">
                <div
                  className="col-sm-4 col-md-4 col-lg-4 col-form-label"
                  htmlFor="lastName"
                >
                  Last Name:
                </div>
                <input
                  type="text"
                  className="form-control col-sm-8 col-md-8 col-lg-8"
                  placeholder="Enter last name"
                  id="lastName"
                  value={lastName}
                  onChange={this.changeHandler}
                />
              </div>

              {/* Phone number */}

              <div className="form-group form-inline form-row profile">
                <div
                  className="col-sm-4 col-md-4 col-lg-4 col-form-label"
                  htmlFor="phone-number"
                >
                  Phone Number:
                </div>
                <input
                  type="text"
                  className="form-control col-sm-8 col-md-8 col-lg-8"
                  placeholder="Enter phone number"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={this.changeHandler}
                />
              </div>

              {/** Primary Skills */}
              <div className="form-group form-inline form-row profile">
                <div
                  className="col-sm-4 col-md-4 col-lg-4 col-form-label"
                  htmlFor="primarySkills"
                >
                  Primary Skills:
                </div>
                <Select
                  value={this.findDefaultValue(primarySkills)}
                  isMulti
                  isClearable
                  className="basic-multi-select col-sm-8 col-md-8 col-lg-8"
                  name="primarySkills"
                  options={techStackList.filter(
                    (option) => !secondarySkills.includes(option.value)
                  )}
                  placeholder="Select Primary Skills"
                  onChange={this.multiSelectHandler("primarySkills")}
                />
              </div>

              {/** Seconday Skills */}

              <div className="form-group form-inline form-row profile">
                <div
                  className="col-sm-4 col-md-4 col-lg-4 col-form-label"
                  htmlFor="secondarySkills"
                >
                  Secondary Skills:
                </div>

                <Select
                  value={this.findDefaultValue(secondarySkills)}
                  isMulti
                  isClearable
                  className="basic-multi-select col-sm-8 col-md-8 col-lg-8"
                  name="secondarySkills"
                  options={techStackList.filter(
                    (option) => !primarySkills.includes(option.value)
                  )}
                  placeholder="Select Secondary Skills"
                  onChange={this.multiSelectHandler("secondarySkills")}
                />
              </div>
            </div>

            <div className="col-sm-5 col-md-5 col-lg-5">
              {/* Position */}
              <div className="form-group form-inline form-row profile">
                <div
                  className="col-sm-5 col-md-5 col-lg-5 col-form-label"
                  htmlFor="phone-number"
                >
                  Position:
                </div>
                <input
                  type="text"
                  className="form-control col-sm-7 col-md-7 col-lg-7"
                  placeholder="Enter position"
                  id="position"
                  value={position}
                  onChange={this.changeHandler}
                  disabled={
                    this.state.modifier === this.state.email ? true : false
                  }
                />
              </div>

              {/* Employment type */}
              <div className="form-group form-inline form-row profile">
                <div
                  className="col-sm-5 col-md-5 col-lg-5 col-form-label"
                  htmlFor="employment-type"
                >
                  Employment Type:
                </div>
                <Select
                  value={
                    employmentType
                      ? employmentTypeList.filter(
                          (type) => type.value === employmentType
                        )
                      : null
                  }
                  className="basic-multi-select col-sm-7 col-md-7 col-lg-7"
                  name="employmentType"
                  options={employmentTypeList}
                  placeholder="Select Employment Type"
                  onChange={this.dropdownSelectHandler("employmentType")}
                />
              </div>

              {/* start date*/}

              <div className="form-group form-inline form-row profile">
                <div
                  className="col-sm-5 col-md-5 col-lg-5 col-form-label"
                  htmlFor="startDate"
                >
                  Contract start date:
                </div>
                <input
                  type="date"
                  className="form-control col-sm-7 col-md-7 col-lg-7"
                  placeholder="Enter contract start date"
                  id="contractStartDate"
                  value={contractStartDate}
                  onChange={this.changeHandler}
                />
              </div>

              {/* end date */}

              <div className="form-group form-inline form-row profile">
                <div
                  className="col-sm-5 col-md-5 col-lg-5 col-form-label"
                  htmlFor="endDate"
                >
                  Contract end date:
                </div>
                <input
                  type="date"
                  className="form-control col-sm-7 col-md-7 col-lg-7"
                  placeholder="Enter contract end date"
                  id="contractEndDate"
                  value={contractEndDate}
                  onChange={this.changeHandler}
                />
              </div>

              {/* Daily Rate */}

              <div className="form-group form-inline form-row profile">
                <div
                  className="col-sm-6 col-md-5 col-lg-5 col-form-label"
                  htmlFor="dailyRate"
                >
                  {" "}
                  Daily Rate:
                </div>
                <input
                  type="text"
                  className="form-control col-sm-7 col-md-7 col-lg-7"
                  placeholder="Enter daily rate"
                  id="dailyRate"
                  value={dailyRate}
                  onChange={this.changeHandler}
                  disabled={
                    this.state.modifier === this.state.email ? true : false
                  }
                />
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="row">
            <div className="profile-button-group">
              <button
                type="submit"
                className="btn btn-success btn-sm float-right d-flex flex-row-reverse m-2"
              >
                SAVE
              </button>
              <button
                type="cancel"
                className="btn btn-danger btn-sm float-right d-flex flex-row-reverse m-2"
                onClick={() => (window.location.href = "/home")}
              >
                CANCEL
              </button>
            </div>
          </div>
        </form>
        {/* Form end here */}
      </div>
    );
  }
}

export default ProfileDetails;
