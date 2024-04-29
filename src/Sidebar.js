import React from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem
} from "cdbreact";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      style={{ display: "flex", height: "100%", overflow: "scroll initial" }}
    >
      <CDBSidebar textColor="#fff" backgroundColor="#1e2838">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a
            href="/"
            className="text-decoration-none"
            style={{ color: "inherit" }}
          >
            Kanary
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="columns">Overview</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/topology" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Topology</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/node" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="user">Node</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/resources" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="chart-line">
                Resources
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/event" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="exclamation-circle">Event</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        
        <CDBSidebarFooter className="sidebar-footer">
          <CDBSidebarContent>
            <NavLink exact to="/settings" activeClassName="activeClicked" style={{ textDecoration: "none", color: "inherit" }}>
              <CDBSidebarMenuItem icon="columns">Settings</CDBSidebarMenuItem>
            </NavLink>
            <a href="https://github.com/orgs/KanaryOrgs/repositories" 
               target="_blank" 
               rel="noopener noreferrer" 
               style={{ textDecoration: "none", color: "inherit" }}>
               <CDBSidebarMenuItem icon="table">Help</CDBSidebarMenuItem>
            </a>
            <NavLink exact to="/logout" activeClassName="activeClicked" style={{ textDecoration: "none", color: "inherit" }}>
              <CDBSidebarMenuItem icon="user">Log Out</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarContent>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
