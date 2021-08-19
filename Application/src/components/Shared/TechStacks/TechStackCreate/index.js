import React, { Component } from "react";
import Axios from "axios";
import Swal from "sweetalert2";

import GetCurrentLocalDateTime from "../../../../utils/GetCurrentLocalDateTime";

import "./style.css";

const addTechStack = (techStackData) => {
  // API call to add new tech stack to db and error handling
  Axios.post("/techstacks/ins", {
    techStackData,
  })
    .then((res) => {
      if (res.status === 200) {
        // alert("Successfuly add a new tech stack.");
      }
    })
    .catch((err) => {
      console.log(err);
      // alert("Failed to add new tech stack, please try again.");
    });
};

class TechStackCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      techname: "",
      techStackList: [],
    };
  }

  // handle change in namefiled including text and single selection
  changeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  submitHandler = (e) => {
    e.preventDefault();

    // convert UTC time into our Malaysia local time
    let dateString = GetCurrentLocalDateTime();

    // escape special characters from search string
    const escapeRegExp = (string) => {
      return string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    };

    //map the list of techstack fetched from DB
    let input = this.state.techname.toUpperCase();
    let result = this.state.techStackList.map((a) => a.techname.toUpperCase());
    let matchInfo = result.find((b) =>
      b.match(escapeRegExp(input.slice(0, 3)))
    );

    //switch condition
    switch (true) {
      case result.indexOf(input) !== -1:
        Swal.fire({
          title: "<h3>Warning</h3>",
          text: "We are unable to create a new value! as we have identified that such tech stack already exist.",
          confirmButtonColor: "#64717B",
          customClass: {
            title: "text-warning",
          },
        });
        break;

      case result.some((b) => b.includes(input.slice(0, 3))):
        Swal.fire({
          title: "<h3>Warning</h3>",
          text:
            "We have identified a similar record in our system " +
            "'" +
            matchInfo +
            "'" +
            " . Do you still want to proceed and add a new tech stack?",

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
            let techStackData = {
              techname: this.state.techname,
              datecreated: dateString,
              datemodified: dateString,
            };

            //calling function to insert data into db
            addTechStack(techStackData);

            Swal.fire({
              text: "New Tech Stack has been successfully created!",
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
          text: "Do you want to add " + input + " as new tech stack?",
          showCancelButton: true,
          confirmButtonText: "SAVE",
          confirmButtonColor: "#218838",
          cancelButtonText: "CANCEL",
          cancelButtonColor: "#63707A",
        }).then((result) => {
          /* Read more about isConfirmed */
          if (result.isConfirmed) {
            // Save it!
            let techStackData = {
              techname: this.state.techname,
              datecreated: dateString,
              datemodified: dateString,
            };

            //calling function to insert data into db
            addTechStack(techStackData);

            Swal.fire({
              text: "New Tech Stack has been successfully created!",
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

  getTechStacks = () => {
    // API call to add new tech stack to db and error handling
    Axios.get("/techstacks/sel", {})
      .then((res) => {
        if (res.status === 200) {
          const techStackList = res.data[0];
          this.setState({ techStackList });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getTechStacks();
  }

  render() {
    const { techname } = this.state;

    return (
      <div>
        <form onSubmit={this.submitHandler.bind(this)}>
          <h4 className="techstack-create-title">Create A New Tech Stack</h4>
          <p className="techstack-create-title">
            Required fields are marked with *.
          </p>
          <div className="form-group form-inline form-row mt-3">
            <p
              className="techstack-name col-sm-4 col-md-4 col-lg-4 text-md-right pr-3"
              htmlFor="createTechStack"
            >
              *Name:
            </p>
            <input
              type="text"
              className="form-control col-sm-8 col-md-8 col-lg-6"
              id="techname"
              value={techname}
              onChange={this.changeHandler}
            />
          </div>
          <p></p>
          <div className="techstack-create-button float-right">
            <button className="btn btn-success btn-sm" type="submit">
              CREATE
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default TechStackCreate;
