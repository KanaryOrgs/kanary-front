import React, { useState } from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isResourcesOpen, setResourcesOpen] = useState(false);

  const toggleResourcesMenu = () => {
    setResourcesOpen(!isResourcesOpen);
  };

  return (
    <div
      style={{ display: "flex", height: "100%", overflow: "scroll initial" }}
    >
      <CDBSidebar textColor="#fff" backgroundColor="#1e2838">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a
            href="/"
            className="text-decoration-none"
            style={{ color: "inherit", fontSize: "30px" }}
          >
            kanary
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="tachometer-alt">Overview</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/topology" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="share-alt">Topology</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/node" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="server">Node</CDBSidebarMenuItem>
            </NavLink>

            {/* Resources with a toggle for the submenus */}
            <div>
              <CDBSidebarMenuItem
                icon="database"
                onClick={toggleResourcesMenu}
                style={{ cursor: "pointer" }}
              >
                Resources
              </CDBSidebarMenuItem>
              {isResourcesOpen && (
                <div style={{ paddingLeft: "20px" }}>
                  <NavLink exact to="/resources/pods" activeClassName="activeClicked">
                    <CDBSidebarMenuItem icon="cube">Pods</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/resources/volume" activeClassName="activeClicked">
                    <CDBSidebarMenuItem icon="hdd">Volume</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/resources/service" activeClassName="activeClicked">
                    <CDBSidebarMenuItem icon="network-wired">Service</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/resources/daemonset" activeClassName="activeClicked">
                    <CDBSidebarMenuItem icon="tasks">Daemonset</CDBSidebarMenuItem>
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink exact to="/event" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="exclamation-circle">Event</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter className="sidebar-footer">
          <CDBSidebarContent>
            <NavLink
              exact
              to="/settings"
              activeClassName="activeClicked"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <CDBSidebarMenuItem icon="cog">Settings</CDBSidebarMenuItem>
            </NavLink>
            <a
              href="https://github.com/orgs/KanaryOrgs/repositories"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <CDBSidebarMenuItem icon="question-circle">Help</CDBSidebarMenuItem>
            </a>
            <NavLink
              exact
              to="/logout"
              activeClassName="activeClicked"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <CDBSidebarMenuItem icon="sign-out-alt">Log Out</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarContent>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
