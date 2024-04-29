import React from "react";
import { Header } from "./Navbar.style";
import { CDBNavbar } from "cdbreact";

const Navbar = () => {
    return (
        <Header>
          <CDBNavbar dark expand="md" scrolling>
            <div>
              <i className="fas fa-bell" style={{ marginRight: "20px" }}></i>
              <i className="fas fa-user"></i>
            </div>
          </CDBNavbar>
        </Header>
    );
}

export default Navbar;
