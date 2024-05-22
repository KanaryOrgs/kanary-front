import React from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import "./Overview.css";

export const Overview = () => {
  return (
    <div className="d-flex E">
      <div><Sidebar/></div>
      <div style={{flex:"1 1 auto", display:"flex", flexFlow:"column", height:"100vh", overflowY:"hidden"}}>
        <Navbar/>
		<div className="event-content">
          <div className="event-header">
            <div>
              <h2>Overview</h2>
              <p>Kubernetes Cluster Overview</p>
            </div>
		  </div>
		</div>
        <div className="content-section">
          <div className="card-container">
            <div className="status-card">
              <h4>Nodes</h4>
              <p>No Connection: 0</p>
              <p>Not Ready: 0</p>
              <p>Ready: 0</p>
            </div>
            <div className="status-card">
              <h4>Pods</h4>
              <p>Error: 0</p>
              <p>Pending: 0</p>
              <p>Running: 1</p>
            </div>
          </div>
          <div className="chart-section">
            <div className="chart-card">
              <h4>% CPU Usage (Avg)</h4>
            </div>
            <div className="chart-card">
              <h4>% RAM Usage (Avg)</h4>
            </div>
          </div>
          <div className="info-section">
            <div className="info-card">
              <h4>Top CPU Intensive Nodes</h4>
            </div>
            <div className="info-card">
              <h4>Top RAM Intensive Nodes</h4>
            </div>
            <div className="info-card">
              <h4>Top CPU Intensive Pods</h4>
            </div>
            <div className="info-card">
              <h4>Top RAM Intensive Pods</h4>
            </div>
          </div>
          <div className="event-section">
            <div className="event-card">
              <h4>Events</h4>
              <p className="event-warning">
                [Warning] Pod "Nginx-pod" restarted at xx:xx : Out of Memory
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Overview;
