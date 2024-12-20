import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const location = useLocation();
  const [isResourcesOpen, setResourcesOpen] = useState(false);

  // 현재 경로가 Resources의 하위 메뉴일 경우 자동으로 열림
  useEffect(() => {
    if (location.pathname.startsWith("/resources")) {
      setResourcesOpen(true);
    } else {
      setResourcesOpen(false);
    }
  }, [location]);

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
              <CDBSidebarMenuItem icon="tachometer-alt">
                Overview
              </CDBSidebarMenuItem>
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
                <FontAwesomeIcon
                  icon={isResourcesOpen ? faChevronUp : faChevronDown}
                  style={{ marginLeft: "70px", paddingRight: "20px" }}
                />
              </CDBSidebarMenuItem>
              {isResourcesOpen && (
                <div style={{ paddingLeft: "20px" }}>
                  <NavLink
                    exact
                    to="/resources/pods"
                    activeClassName="activeClicked"
                  >
                    <CDBSidebarMenuItem icon="cube">Pods</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink
                    exact
                    to="/resources/volume"
                    activeClassName="activeClicked"
                  >
                    <CDBSidebarMenuItem icon="hdd">Volume</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink
                    exact
                    to="/resources/service"
                    activeClassName="activeClicked"
                  >
                    <CDBSidebarMenuItem icon="network-wired">
                      Service
                    </CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink
                    exact
                    to="/resources/daemonset"
                    activeClassName="activeClicked"
                  >
                    <CDBSidebarMenuItem icon="tasks">
                      Daemonset
                    </CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink
                    exact
                    to="/resources/job"
                    activeClassName="activeClicked"
                  >
                    <CDBSidebarMenuItem icon="cogs">Job</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink
                    exact
                    to="/resources/statefulset"
                    activeClassName="activeClicked"
                  >
                    <CDBSidebarMenuItem icon="clone">
                      Statefulset
                    </CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink
                    exact
                    to="/resources/ingress"
                    activeClassName="activeClicked"
                  >
                    <CDBSidebarMenuItem icon="route">
                      Ingress
                    </CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink
                    exact
                    to="/resources/deployment"
                    activeClassName="activeClicked"
                  >
                    <CDBSidebarMenuItem icon="cloud-upload-alt">
                      Deployment
                    </CDBSidebarMenuItem>
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink exact to="/event" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="exclamation-circle">
                Event
              </CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter className="sidebar-footer">
          <CDBSidebarContent>
            <a
              href="https://github.com/orgs/KanaryOrgs/repositories"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <CDBSidebarMenuItem icon="question-circle">
                Help
              </CDBSidebarMenuItem>
            </a>
          </CDBSidebarContent>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
