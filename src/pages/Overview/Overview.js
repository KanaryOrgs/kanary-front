import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { useQuery } from "react-query";
import "./Overview.css";
import { fetchData, countNodeStatus, countPodStatus, confirm } from "../Utils";
import { chartOptions } from "../Chart";

// Swagger UI : /swagger/index.html
export const Overview = () => {
  // 해당 State 들
  const [cpuData, setCpuData] = useState(null);
  const [ramData, setRamData] = useState(null);

  // 컴포넌트 마운트 시 데이터 fetch
  // useQuery로 API 호출 및 상태 관리
  const {
    data: nodes,
    isLoading: loadingNodes,
    error: errorNodes,
  } = useQuery("nodes", () => fetchData("http://localhost:8080/v1/nodes"));

  const {
    data: pods,
    isLoading: loadingPods,
    error: errorPods,
  } = useQuery("pods", () => fetchData("http://localhost:8080/v1/pods"));

  confirm(loadingNodes, errorNodes);
  confirm(loadingPods, errorPods);

  const nodeStatus = countNodeStatus(nodes);
  const podStatus = countPodStatus(pods);

  return (
    <div className="d-flex E">
      <div>
        <Sidebar />
      </div>
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
            <StatusCard title="Nodes" statuses={nodeStatus} />
            <StatusCard title="Pods" statuses={podStatus} />
          </div>

          <div className="chart-container">
            <ChartCard title="% CPU Usage (Avg)" data={cpuData} />
            <ChartCard title="% RAM Usage (Avg)" data={ramData} />
          </div>

          <div className="info-event-container">
            <div className="info-cards">
              <TopCard
                title="Top CPU Intensive Nodes"
                statuses={["Master Node"]}
              />
              <TopCard
                title="Top RAM Intensive Nodes"
                statuses={["Master Node"]}
              />
              <TopCard
                title="Top CPU Intensive Pods"
                statuses={["etcd-master"]}
              />
              <TopCard
                title="Top RAM Intensive Pods"
                statuses={["kube-apiserver-master"]}
              />
            </div>
            <EventCard
              events={[
                {
                  message:
                    "[Warning] Pod 'Nginx-pod' restarted at xx:xx : Out of Memory",
                },
              ]}
            />
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
    <div style={{ height: "200px" }}>
      {data ? (
        <Line data={data} options={chartOptions} />
      ) : (
        <p>Loading chart...</p>
      )}
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
        <p key={index} className="event-warning">
          {event.message}
        </p>
      ))
    ) : (
      <p>Loading events...</p>
    )}
  </div>
);

export default Overview;
