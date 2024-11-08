import React, { useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "../Node/Node.css";
import "./Resources.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Square1, Square1_5, Square2, Square3 } from "../Node/Squares";

// 샘플 데이터
const sampleData = [
  {
    name: "nginx",
    namespace: "default",
    images: ["nginx"], // images 배열
    labels: "run=nginx", // labels
    current: 3, // 가정된 값
    ready: 3, // 가정된 값
    available: 3, // 가정된 값
    node_selector: "app=nginx", // 가정된 값
  },
  {
    name: "nginx2",
    namespace: "nginx",
    images: ["nginx"], // images 배열
    labels: "run=nginx", // labels
    current: 2, // 가정된 값
    ready: 2, // 가정된 값
    available: 2, // 가정된 값
    node_selector: "app=nginx", // 가정된 값
  },
  {
    name: "nginx3",
    namespace: "nginx",
    images: ["nginx"], // images 배열
    labels: "run=nginx", // labels
    current: 3, // 가정된 값
    ready: 2, // 가정된 값
    available: 2, // 가정된 값
    node_selector: "app=nginx", // 가정된 값
  },
  {
    name: "nginx-default",
    namespace: "default",
    images: ["nginx"], // images 배열
    labels: "run=nginx", // labels
    current: 3, // 가정된 값
    ready: 3, // 가정된 값
    available: 3, // 가정된 값
    node_selector: "app=nginx", // 가정된 값
  },
  {
    name: "httpbin",
    namespace: "default",
    images: ["kennethreitz/httpbin"], // images 배열
    labels: "run=pod", // labels
    current: 1, // 가정된 값
    ready: 0, // 가정된 값
    available: 0, // 가정된 값
    node_selector: "app=httpbin", // 가정된 값
  },
  {
    name: "calico-kube-controllers-7c968b5878-frgdz",
    namespace: "kube-system",
    images: ["docker.io/calico/kube-controllers:v3.26.4"], // images 배열
    labels: "k8s-app=calico-kube-controllers", // labels
    current: 3, // 가정된 값
    ready: 3, // 가정된 값
    available: 3, // 가정된 값
    node_selector: "app=calico", // 가정된 값
  },
  {
    name: "calico-node-cccq9",
    namespace: "kube-system",
    images: ["docker.io/calico/node:v3.26.4"], // images 배열
    labels: "k8s-app=calico-node", // labels
    current: 2, // 가정된 값
    ready: 2, // 가정된 값
    available: 2, // 가정된 값
    node_selector: "app=calico", // 가정된 값
  },
  {
    name: "calico-node-xnwt5",
    namespace: "kube-system",
    images: ["docker.io/calico/node:v3.26.4"], // images 배열
    labels: "k8s-app=calico-node", // labels
    current: 2, // 가정된 값
    ready: 2, // 가정된 값
    available: 2, // 가정된 값
    node_selector: "app=calico", // 가정된 값
  },
  {
    name: "coredns-76f75df574-tpdg5",
    namespace: "kube-system",
    images: ["registry.k8s.io/coredns/coredns:v1.11.1"], // images 배열
    labels: "k8s-app=kube-dns", // labels
    current: 2, // 가정된 값
    ready: 2, // 가정된 값
    available: 2, // 가정된 값
    node_selector: "app=coredns", // 가정된 값
  },
  {
    name: "coredns-76f75df574-x72z8",
    namespace: "kube-system",
    images: ["registry.k8s.io/coredns/coredns:v1.11.1"], // images 배열
    labels: "k8s-app=kube-dns", // labels
    current: 2, // 가정된 값
    ready: 2, // 가정된 값
    available: 2, // 가정된 값
    node_selector: "app=coredns", // 가정된 값
  },
  {
    name: "etcd-master",
    namespace: "kube-system",
    images: ["registry.k8s.io/etcd:3.5.12-0"], // images 배열
    labels: "component=etcd", // labels
    current: 1, // 가정된 값
    ready: 1, // 가정된 값
    available: 1, // 가정된 값
    node_selector: "app=etcd", // 가정된 값
  },
  {
    name: "kube-apiserver-master",
    namespace: "kube-system",
    images: ["registry.k8s.io/kube-apiserver:v1.29.4"], // images 배열
    labels: "component=kube-apiserver", // labels
    current: 1, // 가정된 값
    ready: 1, // 가정된 값
    available: 1, // 가정된 값
    node_selector: "app=kube-apiserver", // 가정된 값
  },
  {
    name: "kube-controller-manager-master",
    namespace: "kube-system",
    images: ["registry.k8s.io/kube-controller-manager:v1.29.4"], // images 배열
    labels: "component=kube-controller-manager", // labels
    current: 1, // 가정된 값
    ready: 1, // 가정된 값
    available: 1, // 가정된 값
    node_selector: "app=kube-controller-manager", // 가정된 값
  },
  {
    name: "kube-proxy-ml8kc",
    namespace: "kube-system",
    images: ["registry.k8s.io/kube-proxy:v1.29.4"], // images 배열
    labels: "k8s-app=kube-proxy", // labels
    current: 2, // 가정된 값
    ready: 2, // 가정된 값
    available: 2, // 가정된 값
    node_selector: "app=kube-proxy", // 가정된 값
  },
  {
    name: "kube-proxy-nrtqv",
    namespace: "kube-system",
    images: ["registry.k8s.io/kube-proxy:v1.29.4"], // images 배열
    labels: "k8s-app=kube-proxy", // labels
    current: 2, // 가정된 값
    ready: 2, // 가정된 값
    available: 2, // 가정된 값
    node_selector: "app=kube-proxy", // 가정된 값
  },
  {
    name: "kube-scheduler-master",
    namespace: "kube-system",
    images: ["registry.k8s.io/kube-scheduler:v1.29.4"], // images 배열
    labels: "component=kube-scheduler", // labels
    current: 1, // 가정된 값
    ready: 1, // 가정된 값
    available: 1, // 가정된 값
    node_selector: "app=kube-scheduler", // 가정된 값
  },
];

const statusColors = {
  Stop: "badge-stop",
  Running: "badge-running",
  Pending: "badge-pending",
};

export const Daemonset = () => {
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 필터 팝업 상태
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false); // 디테일 팝업 상태

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

  const openDetailPopup = (row) => {
    setSelectedRow(row);
    setIsDetailPopupOpen(true);
  };

  const closeDetailPopup = () => {
    setIsDetailPopupOpen(false);
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
      <div className="main-content">
        <Navbar />
        <div className="event-content">
          <div className="event-header">
            <h2>Resources-Daemonset</h2>
            <p>Kubernetes Cluster Resources</p>
          </div>
        </div>

        <div className="node-container">
          <div className="content-wrapper">
            <div className="grid-wrapper">
              <div className="mt-5">
                <div className="search-filter-wrapper">
                  <div className="filter-container">
                    {getActiveFilters().map(
                      (
                        filter // 필터 상자
                      ) => (
                        <div key={filter} className="filter-box">
                          <span>{filter}</span>
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="close-icon"
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
                    className="search-input-resources"
                  />

                  <button // 필터 버튼
                    onClick={openPopup}
                    className="button"
                  >
                    Filter
                  </button>
                </div>
                <CDBTable responsive>
                  <CDBTableHeader>
                    <tr className="table-header">
                      <th>NAME</th>
                      <th>NAMESPACE</th>
                      <th>IMAGES</th>
                      <th>LABLES</th>
                      <th>CURRENT</th>
                      <th>READY</th>
                      <th>AVAILABLE</th>
                      <th>NODE SELECTOR</th>
                    </tr>
                  </CDBTableHeader>
                  <CDBTableBody>
                    {currentPageData.map((row, index) => (
                      <tr key={index} onClick={() => openDetailPopup(row)}>
                        <td>{row.name}</td>
                        <td>{row.namespace}</td>
                        <td>{row.images.join(", ")}</td>{" "}
                        {/* images 배열을 문자열로 변환 */}
                        <td>{row.labels}</td>
                        <td>{row.current}</td>
                        <td>{row.ready}</td>
                        <td>{row.available}</td>
                        <td>{row.node_selector}</td>
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
                      className={`pagination-button ${
                        currentPage === page + 1 ? "active" : ""
                      }`}
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
                <div className="filter-popup">
                  <div>
                    <input
                      type="checkbox"
                      checked={isSelectAllChecked}
                      onChange={handleSelectAllChange}
                    />
                    <label>Select All</label>
                  </div>
                  <div className="checkbox-container">
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

            {isDetailPopupOpen && (
              <div className="popup">
                <h2>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="close-button"
                    onClick={closeDetailPopup}
                  />
                  {selectedRow.name}
                </h2>
                <div className="popup-content">
                  <Square1_5 topLeftText="Name Space">
                    {selectedRow.namespace}
                  </Square1_5>
                  <Square1_5 topLeftText="Images">
                    {selectedRow.images}
                  </Square1_5>
                  <Square1_5 topLeftText="Labels">
                    {selectedRow.labels}
                  </Square1_5>
                  <Square1_5 topLeftText="Desired">
                    {selectedRow.desired}
                  </Square1_5>
                  <Square1_5 topLeftText="Current">
                    {selectedRow.current}
                  </Square1_5>
                  <Square1_5 topLeftText="Ready">{selectedRow.ready}</Square1_5>
                  <Square1_5 topLeftText="Available">
                    {selectedRow.available}
                  </Square1_5>
                  <Square1_5 topLeftText="Node Selector">
                    {selectedRow.node_selector}
                  </Square1_5>
                  <Square1_5 topLeftText="Creation Time">
                    {selectedRow.creation_time}
                  </Square1_5>
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
