import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "./Node/Node.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

// 샘플 데이터
const sampleData = [
  {
    name: "nginx",
    namespace: "default",
    ip: "10.151.221.32",
    images: ["nginx"],
    status: "Running",
    cpu_usage: 3,
    ram_usage: 7,
    labels: {
      run: "nginx",
    },
    restarts: 0,
    node_name: "worker",
    start_time: "2024-05-22T11:04:56Z",
    volumes: ["kube-api-access-jmlkn"],
  },
  {
    name: "nginx2",
    namespace: "nginx",
    images: ["nginx"],
    ip: "10.24.11.231",
    status: "Running",
    labels: {
      run: "nginx",
    },
    cpu_usage: 3,
    ram_usage: 12,
    restarts: 0,
    start_time: "2024-05-22T11:06:56Z",
  },

  {
    name: "nginx3",
    namespace: "nginx",
    images: ["nginx"],
    ip: "10.24.11.181",
    status: "Running",
    labels: {
      run: "nginx",
    },
    cpu_usage: 9,
    ram_usage: 15,
    restarts: 0,
    start_time: "2024-05-22T11:08:56Z",
  },
  {
    name: "nginx-default",
    namespace: "default",
    images: ["nginx"],
    ip: "10.212.464.69",
    status: "Running",
    labels: {
      run: "nginx",
    },
    cpu_usage: 4,
    ram_usage: 7,
    restarts: 0,
    start_time: "2024-05-21T06:04:51Z",
  },
  {
    name: "httpbin",
    namespace: "default",
    images: ["kennethreitz/httpbin"],
    ip: "10.112.473.22",
    status: "Pending",
    labels: {
      run: "pod",
    },
    cpu_usage: 8,
    ram_usage: 15,
    restarts: 0,
    start_time: "2024-05-28T04:02:56Z",
  },
  {
    name: "calico-kube-controllers-7c968b5878-frgdz",
    namespace: "kube-system",
    images: ["docker.io/calico/kube-controllers:v3.26.4"],
    ip: "10.244.171.66",
    status: "Running",
    labels: {
      "k8s-app": "calico-kube-controllers",
      "pod-template-hash": "7c968b5878",
    },
    cpu_usage: 8,
    ram_usage: 15,
    restarts: 0,
    start_time: "2024-05-03T14:15:26Z",
  },
  {
    name: "calico-node-cccq9",
    namespace: "kube-system",
    images: ["docker.io/calico/node:v3.26.4"],
    ip: "10.244.171.61",
    status: "Running",
    labels: {
      "controller-revision-hash": "7489b54556",
      "k8s-app": "calico-node",
      "pod-template-generation": "1",
    },
    cpu_usage: 8,
    ram_usage: 12,
    restarts: 0,
    start_time: "2024-05-03T14:15:26Z",
  },
  {
    name: "calico-node-xnwt5",
    namespace: "kube-system",
    images: ["docker.io/calico/node:v3.26.4"],
    ip: "10.244.171.53",
    status: "Running",
    labels: {
      "controller-revision-hash": "7489b54556",
      "k8s-app": "calico-node",
      "pod-template-generation": "1",
    },
    cpu_usage: 8,
    ram_usage: 7,
    restarts: 0,
    start_time: "2024-05-03T14:15:26Z",
  },
  {
    name: "coredns-76f75df574-tpdg5",
    namespace: "kube-system",
    images: ["registry.k8s.io/coredns/coredns:v1.11.1"],
    ip: "10.244.171.67",
    status: "Running",
    labels: {
      "k8s-app": "kube-dns",
      "pod-template-hash": "76f75df574",
    },
    cpu_usage: 2,
    ram_usage: 20,
    restarts: 0,
    start_time: "2024-05-03T14:15:26Z",
  },
  {
    name: "coredns-76f75df574-x72z8",
    namespace: "kube-system",
    images: ["registry.k8s.io/coredns/coredns:v1.11.1"],
    ip: "10.244.171.65",
    status: "Running",
    labels: {
      "k8s-app": "kube-dns",
      "pod-template-hash": "76f75df574",
    },
    cpu_usage: 5,
    ram_usage: 35,
    restarts: 0,
    start_time: "2024-05-03T14:15:26Z",
  },
  {
    name: "etcd-master",
    namespace: "kube-system",
    images: ["registry.k8s.io/etcd:3.5.12-0"],
    ip: "10.244.171.45",
    status: "Running",
    labels: {
      component: "etcd",
      tier: "control-plane",
    },
    cpu_usage: 2,
    ram_usage: 44,
    restarts: 0,
    start_time: "2024-05-03T14:15:26Z",
  },
  {
    name: "kube-apiserver-master",
    namespace: "kube-system",
    images: ["registry.k8s.io/kube-apiserver:v1.29.4"],
    ip: "10.244.171.31",
    status: "Running",
    labels: {
      component: "kube-apiserver",
      tier: "control-plane",
    },
    cpu_usage: 8,
    ram_usage: 15,
    restarts: 0,
    start_time: "2024-05-03T14:15:26Z",
  },
  {
    name: "kube-controller-manager-master",
    namespace: "kube-system",
    images: ["registry.k8s.io/kube-controller-manager:v1.29.4"],
    ip: "10.244.171.39",
    status: "Running",
    labels: {
      component: "kube-controller-manager",
      tier: "control-plane",
    },
    cpu_usage: 8,
    ram_usage: 15,
    restarts: 1,
    start_time: "2024-05-03T14:15:26Z",
  },
  {
    name: "kube-proxy-ml8kc",
    namespace: "kube-system",
    images: ["registry.k8s.io/kube-proxy:v1.29.4"],
    ip: "10.244.171.36",
    status: "Running",
    labels: {
      "controller-revision-hash": "5fbd756bc7",
      "k8s-app": "kube-proxy",
      "pod-template-generation": "1",
    },
    cpu_usage: 8,
    ram_usage: 15,
    restarts: 0,
    start_time: "2024-05-03T14:15:26Z",
  },
  {
    name: "kube-proxy-nrtqv",
    namespace: "kube-system",
    images: ["registry.k8s.io/kube-proxy:v1.29.4"],
    ip: "10.244.171.25",
    status: "Running",
    labels: {
      "controller-revision-hash": "5fbd756bc7",
      "k8s-app": "kube-proxy",
      "pod-template-generation": "1",
    },
    cpu_usage: 8,
    ram_usage: 15,
    restarts: 0,
    start_time: "2024-05-03T14:15:26Z",
  },
  {
    name: "kube-scheduler-master",
    namespace: "kube-system",
    images: ["registry.k8s.io/kube-scheduler:v1.29.4"],
    ip: "10.244.171.22",
    status: "Running",
    labels: {
      component: "kube-scheduler",
      tier: "control-plane",
    },
    cpu_usage: 8,
    ram_usage: 15,
    restarts: 1,
    start_time: "2024-05-03T14:15:26Z",
  },
];

const statusColors = {
  Stop: "badge-stop",
  Running: "badge-running",
  Pending: "badge-pending",
};

export const Resources = () => {
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [checkboxes, setCheckboxes] = useState([
    { id: 1, label: "nginx", isChecked: false },
    { id: 2, label: "kube", isChecked: false },
    { id: 3, label: "etcd", isChecked: false },
    // Add more checkboxes as needed
  ]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSelectAllChange = () => {
    const newSelectAllChecked = !isSelectAllChecked;
    setIsSelectAllChecked(newSelectAllChecked);
    setCheckboxes(
      checkboxes.map((checkbox) => ({
        ...checkbox,
        isChecked: newSelectAllChecked,
      }))
    );
  };

  const handleCheckboxChange = (id) => {
    const updatedCheckboxes = checkboxes.map((checkbox) =>
      checkbox.id === id
        ? { ...checkbox, isChecked: !checkbox.isChecked }
        : checkbox
    );
    setCheckboxes(updatedCheckboxes);

    const allChecked = updatedCheckboxes.every(
      (checkbox) => checkbox.isChecked
    );
    const noneChecked = updatedCheckboxes.every(
      (checkbox) => !checkbox.isChecked
    );
    if (allChecked || noneChecked) {
      setIsSelectAllChecked(allChecked);
    }
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleRemoveFilter = (label) => {
    const updatedCheckboxes = checkboxes.map((checkbox) =>
      checkbox.label === label ? { ...checkbox, isChecked: false } : checkbox
    );
    setCheckboxes(updatedCheckboxes);
    setIsSelectAllChecked(false);
  };

  const getActiveFilters = () => {
    return checkboxes
      .filter((checkbox) => checkbox.isChecked)
      .map((checkbox) => checkbox.label);
  };

  const filteredData = sampleData.filter((item) => {
    const matchesSearchTerm = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const activeFilters = getActiveFilters();
    const matchesFilters =
      activeFilters.length === 0 ||
      activeFilters.every((filter) => item.name.includes(filter));
    return matchesSearchTerm && matchesFilters;
  });

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredData.length);
  const currentPageData = filteredData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="d-flex E">
      <div>
        <Sidebar />
      </div>
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          flexFlow: "column",
          height: "100vh",
          overflowY: "hidden",
        }}
      >
        <Navbar />
        <div className="event-content">
          <div className="event-header">
            <div>
              <h2>Resources</h2>
              <p>Kubernetes Cluster Resources</p>
            </div>
          </div>
        </div>
        <div style={{ height: "100%" }}>
          <div
            style={{
              padding: "20px 5%",
              height: "calc(100% - 64px)",
              overflowY: "scroll",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(1, minmax(200px, 100%))",
              }}
            >
              <div className="mt-5">
                <div
                  style={{
                    marginBottom: "13px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {getActiveFilters().map(
                      (
                        filter // 필터 상자
                      ) => (
                        <div
                          key={filter}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            textAlign: "center",
                            backgroundColor: "#004098",
                            color: "white",
                            borderRadius: "4px",
                            padding: "3px 20px",
                            marginRight: "10px",
                          }}
                        >
                          <span>{filter}</span>
                          <FontAwesomeIcon
                            icon={faTimes}
                            style={{ marginLeft: "5px", cursor: "pointer" }}
                            onClick={() => handleRemoveFilter(filter)}
                          />
                        </div>
                      )
                    )}
                  </div>
                  <input // 검색창
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{
                      paddingRight: "10px",
                      paddingLeft: "10px",
                      flex: "1",
                      marginRight: "10px",
                    }}
                  />
                  <button // 필터 버튼
                    onClick={openPopup}
                    style={{
                      padding: "0px 20px",
                      backgroundColor: "#004098",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      height: "30px",
                    }}
                  >
                    Filter
                  </button>
                </div>
                <CDBTable responsive>
                  <CDBTableHeader>
                    <tr style={{ verticalAlign: "middle" }}>
                      <th
                        style={{
                          backgroundColor: "#7C7C7C",
                          color: "#292929",
                          fontSize: "12px",
                        }}
                      >
                        NAME
                      </th>
                      <th
                        style={{
                          backgroundColor: "#7C7C7C",
                          color: "#292929",
                          fontSize: "12px",
                        }}
                      >
                        NAMESPACE
                      </th>
                      <th
                        style={{
                          backgroundColor: "#7C7C7C",
                          color: "#292929",
                          fontSize: "12px",
                        }}
                      >
                        IP
                      </th>
                      <th
                        style={{
                          backgroundColor: "#7C7C7C",
                          color: "#292929",
                          fontSize: "12px",
                        }}
                      >
                        CPU
                      </th>
                      <th
                        style={{
                          backgroundColor: "#7C7C7C",
                          color: "#292929",
                          fontSize: "12px",
                        }}
                      >
                        MEM
                      </th>
                      <th
                        style={{
                          backgroundColor: "#7C7C7C",
                          color: "#292929",
                          fontSize: "12px",
                        }}
                      >
                        STATUS
                      </th>
                      <th
                        style={{
                          backgroundColor: "#7C7C7C",
                          color: "#292929",
                          fontSize: "12px",
                        }}
                      >
                        DATE CREATED
                      </th>
                    </tr>
                  </CDBTableHeader>
                  <CDBTableBody>
                    {currentPageData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.name}</td>
                        <td>{row.namespace}</td>
                        <td>{row.ip}</td>
                        <td>{row.cpu_usage}%</td>
                        <td>{row.ram_usage}%</td>
                        <td>
                          <span className={`badge ${statusColors[row.status]}`}>
                            {row.status}
                          </span>
                        </td>
                        <td>{row.start_time}</td>
                      </tr>
                    ))}
                  </CDBTableBody>
                </CDBTable>

                <div className="d-flex justify-content-center">
                  {[
                    ...Array(Math.ceil(filteredData.length / pageSize)).keys(),
                  ].map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page + 1)}
                      disabled={currentPage === page + 1}
                      style={{
                        width: "30px",
                        height: "30px",
                        fontSize: "14px",
                        border: "none",
                        borderRadius: "4px",
                        backgroundColor:
                          currentPage === page + 1 ? "#004098" : "#1F2838",
                        color: "white",
                        margin: "0 5px",
                      }}
                    >
                      {page + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {isPopupOpen && (
              <div className="popup">
                <h2>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="close-button"
                    onClick={closePopup}
                  />{" "}
                  Select Filters
                </h2>
                <div
                  style={{ overflowY: "auto", maxHeight: "calc(100vh - 15%)" }}
                >
                  <div>
                    <input
                      type="checkbox"
                      checked={isSelectAllChecked}
                      onChange={handleSelectAllChange}
                    />
                    <label>Select All</label>
                  </div>
                  <div style={{ padding: "10px 0" }}>
                    {checkboxes.map((checkbox) => (
                      <div key={checkbox.id}>
                        <input
                          type="checkbox"
                          checked={checkbox.isChecked}
                          onChange={() => handleCheckboxChange(checkbox.id)}
                        />
                        <label>{checkbox.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <footer className="footer">
              <div className="d-flex align-items-center"></div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
