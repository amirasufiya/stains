import React, { Component } from "react";
import Select from "react-select";

class UpdateApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // appid: props.appid,
    };
  }

  render() {
    // const { appid } = this.state;

    return (
      <div>
        <form className="form-group">
          <div className="updateapp-title">Update Application</div>
          <div className="form-group form-inline form-row">
            <div className="col-form-label col-sm-4 col-md-4 col-lg-4 text-md-right pr-3">
              Name:
            </div>
            <input
              className="form-control col-sm-8 col-md-6 col-lg-6"
              type="text"
              placeholder="Appname"
            />
          </div>
          <div className="form-group form-inline form-row">
            <div className="col-form-label col-sm-4 col-md-4 col-lg-4 text-md-right pr-3">
              URL:
            </div>
            <input
              className="form-control col-sm-8 col-md-6 col-lg-6"
              type="text"
              placeholder="URL"
            />
          </div>
          <div className="form-group form-inline form-row">
            <div className="col-form-label col-sm-4 col-md-4 col-lg-4 text-md-right pr-3">
              DevOps Link:
            </div>
            <input
              className="form-control col-sm-8 col-md-6 col-lg-6"
              type="text"
              placeholder="DevOps"
            />
          </div>
          <div className="form-group form-inline form-row">
            <div className="col-form-label col-sm-4 col-md-4 col-lg-4 text-md-right pr-3">
              Tech Stacks:
            </div>
            <Select
              // value={this.state.apptechStacks.value}
              isMulti
              isSearchable
              isClearable
              className="updateapp-multiselect basic-multi-select"
              name="apptechStacks"
              options={this.state.techStackList}
              placeholder="Select Tech Stack"
              // onChange={this.multiSelectHandler("apptechStacks")}
            />
          </div>
          <div className="form-group form-inline form-row">
            <div className="col-form-label col-sm-4 col-md-4 col-lg-4 text-md-right pr-3">
              Member Count:
            </div>
            <input
              className="form-control col-sm-8 col-md-6 col-lg-6"
              type="text"
              placeholder="No. of App Member"
            />
          </div>
          <div className="form-group form-inline form-row">
            <div className="col-form-label col-sm-4 col-md-4 col-lg-4 text-md-right pr-3">
              Comments:
            </div>
            <input
              className="form-control col-sm-8 col-md-6 col-lg-6"
              type="text"
              placeholder="Comment"
            />
          </div>
          <div className="updateapp-update-button float-right">
            <button type="submit" className="btn btn-success btn-sm">
              UPDATE
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default UpdateApp;