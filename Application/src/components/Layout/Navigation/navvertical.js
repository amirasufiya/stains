import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
import "./style.css";
import Axios from "axios";

class NavVertical extends Component {
  state = {
    vertical: [],
    menuIsCollapsed: "",
  };

  //to store data & render in DOM
  componentDidMount() {
    Axios.get("/navmenu/vertical").then((res) => {
      const vertical = res.data[0];
      this.setState({ vertical });
    });
  }

  render() {
    let { vertical } = this.state;
    let { menuIsCollapsed } = this.state;

    return (
      <>
        <CDBSidebar
          className={
            localStorage.getItem("sidebarState") === "false" ? "" : "toggled"
          }
        >
          <CDBSidebarContent>
            <CDBSidebarMenu>
              {vertical.map((item, index) => {
                return (
                  <div key={index}>
                    <NavLink exact to={item.menuitemlink}>
                      <CDBSidebarMenuItem icon={item.iconurl}>
                        {item.menuitemname}
                      </CDBSidebarMenuItem>
                    </NavLink>
                  </div>
                );
              })}
            </CDBSidebarMenu>
          </CDBSidebarContent>

          {menuIsCollapsed ? (
            <CDBSidebarHeader
              prefix={
                <BsChevronDoubleLeft
                  onClick={() =>
                    this.setState(
                      { menuIsCollapsed: false },
                      localStorage.setItem("sidebarState", false)
                    )
                  }
                ></BsChevronDoubleLeft>
              }
            ></CDBSidebarHeader>
          ) : (
            <CDBSidebarHeader
              prefix={
                <BsChevronDoubleRight
                  onClick={() =>
                    this.setState(
                      { menuIsCollapsed: true },
                      localStorage.setItem("sidebarState", true)
                    )
                  }
                ></BsChevronDoubleRight>
              }
            ></CDBSidebarHeader>
          )}
          
        </CDBSidebar>
      </>
    );
  }
}

export default NavVertical;
