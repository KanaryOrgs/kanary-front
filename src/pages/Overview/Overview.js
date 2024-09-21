import React, { useState, useEffect } from "react";
import { Line } from 'react-chartjs-2';
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { cpuData, ramData } from "./overview-dummy";
import "./Overview.css";

// Chart.js components 등록
import { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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

// Backend에서 데이터 가져오기(fetch)
const fetchData = async (url, setData, setLoading, setError) => {
  try {
    setLoading(true);
    const response = await fetch(url);
    const result = await response.json();
    setData(result);
  } catch (error) {
    setError(true);
  } finally {
    setLoading(false);
  }
};

// // 노드 상태 JSON에서 뽑기
// const countNodeStatus = (nodes) => {
//   let noConnection = 0;
//   let notReady = 0;
//   let ready = 0;

//   nodes.forEach(node => {
//     if (node.status === "Ready") {
//       ready++;
//     } else if (node.status === "NotReady") {
//       notReady++;
//     } else {
//       noConnection++;
//     }
//   });

//   return [`No Connection: ${noConnection}`, `Not Ready: ${notReady}`, `Ready: ${ready}`];
// };

export const Overview = () => {

  // // 해당 State 들
  // const [cpuData, setCpuData] = useState(null);
  // const [ramData, setRamData] = useState(null);
  // const [nodes, setNodes] = useState([]);
  // const [events, setEvents] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(false);

  // // 컴포넌트 마운트 시 데이터 fetch
  // useEffect(() => {
  //   fetchData("/api/cpu-usage", setCpuData, setLoading, setError);
  //   fetchData("/api/ram-usage", setRamData, setLoading, setError);
  //   fetchData("http://localhost:8080/v1/nodes", setNodes, setLoading, setError);
  // }, []);

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  // if (error) {
  //   return <p>Error loading data</p>;
  // }

  // const nodeStatus = countNodeStatus(nodes);

  return (
    <div className="d-flex E">
      <div><Sidebar /></div>
      <div className="main-content">
        <Navbar />
        <div className="event-content">
          <div className="event-header">
            <h2>Overview</h2>
            <p>Kubernetes Cluster Overview</p>
          </div>
        </div>

        <div className="content-section">
          <div className="card-container">
            {/* backend와 통신할 때 이런식으로 */}
            {/* <StatusCard title="Nodes" statuses={nodeStatuses} /> */}
            <StatusCard title="Nodes" statuses={["No Connection: 0", "Not Ready: 0", "Ready: 1"]} />
            <StatusCard title="Pods" statuses={["Error: 1", "Pending: 0", "Running: 15"]} />
          </div>

          <div className="chart-container">
            <ChartCard title="% CPU Usage (Avg)" data={cpuData} />
            <ChartCard title="% RAM Usage (Avg)" data={ramData} />
          </div>

          <div className="info-event-container">
            <div className="info-cards">
              <TopCard title="Top CPU Intensive Nodes" statuses={["Master Node"]} />
              <TopCard title="Top RAM Intensive Nodes" statuses={["Master Node"]} />
              <TopCard title="Top CPU Intensive Pods" statuses={["etcd-master"]} />
              <TopCard title="Top RAM Intensive Pods" statuses={["kube-apiserver-master"]} />
            </div>
            <EventCard events={[{ message: "[Warning] Pod 'Nginx-pod' restarted at xx:xx : Out of Memory" }]} />
          </div>
        </div>
      </div>
    </div>
  );
};

// 컴포넌트
const StatusCard = ({ title, statuses }) => (
  <div className="status-card">
    <h4>{title}</h4>
    {statuses.map((status, index) => (
      <p key={index}>{status}</p>
    ))}
  </div>
);

const ChartCard = ({ title, data }) => (
  <div className="chart-card">
    <h4>{title}</h4>
    <div style={{ height: '200px' }}>
      {data ? <Line data={data} options={chartOptions} /> : <p>Loading chart...</p>}
    </div>
  </div>
);

// 컴포넌트
const TopCard = ({ title, statuses }) => (
  <div className="top-card">
    <h5>{title}</h5>
    {statuses.map((status, index) => (
      <p key={index}>{status}</p>
    ))}
  </div>
);

const EventCard = ({ events }) => (
  <div className="event-card">
    <h4>Events</h4>
    {events ? (
      events.map((event, index) => (
        <p key={index} className="event-warning">{event.message}</p>
      ))
    ) : (
      <p>Loading events...</p>
    )}
  </div>
);

export default Overview;