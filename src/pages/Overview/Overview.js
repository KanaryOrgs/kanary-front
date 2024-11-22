import React from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { useQuery } from "react-query";
import "./Overview.css";
import "../Resources/Resources.css";
import { fetchData, countNodeStatus, countPodStatus, confirm } from "../Utils";

const statusColors = {
  "No Connection": "badge-stop",
  "Not Ready": "badge-pending",
  "Ready": "badge-running",
  "Running": "badge-running",
  "Pending": "badge-pending",
  "Succeeded": "badge-succeeded",
  "Error": "badge-stop"
};


// Swagger UI : /swagger/index.html
export const Overview = () => {
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

  const {
    data: events,
    isLoading: loadingEvents,
    error: errorEvents,
  } = useQuery("events", () => fetchData("http://localhost:8080/v1/events"));

  const {
    data: services,
    isLoading: loadingServices,
    error: errorServices,
  } = useQuery("services", () =>
    fetchData("http://localhost:8080/v1/services")
  );

  const {
    data: daemonsets,
    isLoading: loadingDaemon,
    error: errorDaemon,
  } = useQuery("daemonsets", () =>
    fetchData("http://localhost:8080/v1/daemonsets")
  );

  const {
    data: pvs,
    isLoading: loadingPvs,
    error: errorPvs,
  } = useQuery("pvs", () => fetchData("http://localhost:8080/v1/pvs"));

  const {
    data: pvcs,
    isLoading: loadingPvcs,
    error: errorPvcs,
  } = useQuery("pvcs", () => fetchData("http://localhost:8080/v1/pvcs"));

  const {
    data: scs,
    isLoading: loadingScs,
    error: errorScs,
  } = useQuery("scs", () =>
    fetchData("http://localhost:8080/v1/storageclasses")
  );

  const {
    data: sfs,
    isLoading: loadingSfs,
    error: errorSfs,
  } = useQuery("sfs", () => fetchData("http://localhost:8080/v1/statefulsets"));

  const {
    data: ingresses,
    isLoading: loadingIngresses,
    error: errorIngresses,
  } = useQuery("ingresses", () =>
    fetchData("http://localhost:8080/v1/ingresses")
  );
  const {
    data: jobs,
    isLoading: loadingJobs,
    error: errorJobs,
    refetch: refetchJobs,
  } = useQuery("jobs", () => fetchData("http://localhost:8080/v1/jobs"));

  const {
    data: cronjobs,
    isLoading: loadingCronjobs,
    error: errorCronjobs,
    refetch: refetchCronjobs,
  } = useQuery("cronjobs", () =>
    fetchData("http://localhost:8080/v1/cronjobs")
  );

  confirm(loadingServices, errorServices);
  confirm(loadingNodes, errorNodes);
  confirm(loadingPods, errorPods);
  confirm(loadingEvents, errorEvents);
  confirm(loadingDaemon, errorDaemon);
  confirm(loadingPvs, errorPvs);
  confirm(loadingPvcs, errorPvcs);
  confirm(loadingScs, errorScs);
  confirm(loadingSfs, errorSfs);
  confirm(loadingIngresses, errorIngresses);
  confirm(loadingJobs, errorJobs);
  confirm(loadingCronjobs, errorCronjobs);

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
            <ResourceCard title="Services" resources={services} />
            <ResourceCard title="Daemonsets" resources={daemonsets} />
          </div>
          <div className="card-container">
            {/* backend와 통신할 때 이런식으로 */}
            <ResourceCard title="PersistentVolumes" resources={pvs} />
            <ResourceCard title="PersistentVolumeClaims" resources={pvcs} />
            <ResourceCard title="StorageClasses" resources={scs} />
            <ResourceCard title="StatefulSets" resources={sfs} />
          </div>

          <div className="card-container">
            <ResourceCard title="Ingresses" resources={ingresses} />

            <ResourceCard
              title="Job/Cronjob"
              resources={[...(jobs || []), ...(cronjobs || [])]} // 두 배열 결합
            />

            <EventCard events={events || []} />
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
    {statuses.map((status, index) => {
      // 상태 문자열 전체에서 키를 찾음
      const key = Object.keys(statusColors).find(k => status.startsWith(k));
      return (
        <p key={index}>
          <span className={`badge ${statusColors[key] || "badge-default"}`}>
            {status}
          </span>
        </p>
      );
    })}
  </div>
);

const ResourceCard = ({ title, resources = [] }) => (
  <div className="status-card">
    <h4>{title}</h4>
    <p>Total: {resources.length}</p>
    <div className="card-detail">
      <ul>
        {resources.map((resource, index) => (
          <li key={index}>{resource.name}</li>
        ))}
      </ul>
    </div>
  </div>
);

const EventCard = ({ events }) => (
  <div className="event-card">
    <h4>Events</h4>
    {events && events.length > 0 ? (
      events.map((event, index) => (
        <p key={index} className="event-warning">
          [{event.namespace}] {event.reason}: {event.message || "No message"}
        </p>
      ))
    ) : (
      <p>No events available.</p>
    )}
  </div>
);

export default Overview;
