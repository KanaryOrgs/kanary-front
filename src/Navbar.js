import React from "react";
import { CDBNavbar } from "cdbreact";
import './Navbar.css'; // CSS 파일로 스타일을 분리

const Navbar = () => {
    return (
        <header className="header">
          <CDBNavbar dark expand="md" scrolling>
            <div>
              <i className="fas fa-bell" style={{ marginRight: "20px" }}></i>
              <i className="fas fa-user"></i>
            </div>
          </CDBNavbar>
        </header>
    );
}

export default Navbar;