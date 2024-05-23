import React from "react";
import { Line } from 'react-chartjs-2';
import { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto';
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import "./Overview.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
// Sample data for the charts
const cpuData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: '% CPU Usage',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
    },
  ],
};

const ramData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: '% RAM Usage',
      data: [45, 39, 60, 71, 46, 35, 30],
      fill: false,
      backgroundColor: 'rgba(153,102,255,0.4)',
      borderColor: 'rgba(153,102,255,1)',
    },
  ],
};


const chartOptions = {
  maintainAspectRatio: false,
  scales: {
    x: {
      beginAtZero: true,
    },
    y: {
      beginAtZero: true,
    },
  },
};

export const Overview = () => {
  return (
    <div className="d-flex dashboard">
      <div><Sidebar /></div>
      <div style={{ flex: "1 1 auto", display: "flex", flexFlow: "column", height: "100vh", overflowY: "hidden" }}>
        <Navbar />
        <div className="event-content">
          <div className="event-header">
            <div>
              <h2>Overview</h2>
              <p>Kubernetes Cluster Topology</p>
            </div>
          </div>
        </div>
        <div className="content-section">
          <div className="card-container">
            <div className="status-card">
              <h4>Nodes</h4>
              <p>No Connection: 0</p>
              <p>Not Ready: 0</p>
              <p>Ready: 12</p>
            </div>
            <div className="status-card">
              <h4>Pods</h4>
              <p>Error: 0</p>
              <p>Pending: 0</p>
              <p>Running: 12</p>
            </div>
          </div>
          <div className="chart-info-container">
            <div className="chart-card">
              <h4>% CPU Usage (Avg)</h4>
              <div style={{ height: '200px' }}>
                <Line data={cpuData} options={chartOptions} />
              </div>
            </div>
            <div className="info-cards">
              <div className="info-card">
                <h4>Top CPU Intensive Nodes</h4>
                <p>Node 1</p>
              </div>
              <div className="info-card">
                <h4>Top RAM Intensive Nodes</h4>
                <p>Node 2</p>
              </div>
              <div className="info-card">
                <h4>Top CPU Intensive Pods</h4>
                <p>etcd-master</p>
              </div>
              <div className="info-card">
                <h4>Top RAM Intensive Pods</h4>
                <p>kube-apiserver-master</p>
              </div>
            </div>
          </div>
          <div className="chart-event-container">
            <div className="chart-card">
              <h4>% RAM Usage (Avg)</h4>
              <div style={{ height: '200px' }}>
                <Line data={ramData} options={chartOptions} />
              </div>
            </div>
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