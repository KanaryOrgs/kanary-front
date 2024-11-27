import React from "react";
import { CDBNavbar } from "cdbreact";
import "./Navbar.css"; // CSS 파일로 스타일을 분리

const Navbar = () => {
  return (
    <header className="header">
      <CDBNavbar dark expand="md" scrolling>
        <div>
          <i style={{ marginRight: "20px" }}></i>
          <i></i>
        </div>
      </CDBNavbar>
    </header>
  );
};

export default Navbar;
