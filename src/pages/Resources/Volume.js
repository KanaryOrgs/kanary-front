import React, { useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "../Node/Node.css";
import "./Resources.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

// 샘플 데이터
const sampleData = [
    {
      name: "nginx",
      capacity: "10Gi", // 가정된 값
      accessMode: "ReadWriteOnce", // 가정된 값
      reclaimPolicy: "Retain", // 가정된 값
      status: "Running",
      labels: "run=nginx",
    },
    {
      name: "nginx2",
      capacity: "10Gi", // 가정된 값
      accessMode: "ReadWriteOnce", // 가정된 값
      reclaimPolicy: "Retain", // 가정된 값
      status: "Running",
      labels: "run=nginx",
    },
    {
      name: "nginx3",
      capacity: "15Gi", // 가정된 값
      accessMode: "ReadWriteMany", // 가정된 값
      reclaimPolicy: "Delete", // 가정된 값
      status: "Running",
      labels: "run=nginx",
    },
    {
      name: "nginx-default",
      capacity: "10Gi", // 가정된 값
      accessMode: "ReadWriteOnce", // 가정된 값
      reclaimPolicy: "Retain", // 가정된 값
      status: "Running",
      labels: "run=nginx",
    },
    {
      name: "httpbin",
      capacity: "5Gi", // 가정된 값
      accessMode: "ReadWriteOnce", // 가정된 값
      reclaimPolicy: "Delete", // 가정된 값
      status: "Pending",
      labels: "run=pod",
    },
    {
      name: "calico-kube-controllers-7c968b5878-frgdz",
      capacity: "20Gi", // 가정된 값
      accessMode: "ReadWriteOnce", // 가정된 값
      reclaimPolicy: "Retain", // 가정된 값
      status: "Running",
      labels: "k8s-app=calico-kube-controllers,pod-template-hash=7c968b5878",
    },
    {
      name: "calico-node-cccq9",
      capacity: "20Gi", // 가정된 값
      accessMode: "ReadWriteMany", // 가정된 값
      reclaimPolicy: "Retain", // 가정된 값
      status: "Running",
      labels: "controller-revision-hash=7489b54556,k8s-app=calico-node,pod-template-generation=1",
    },
    {
      name: "calico-node-xnwt5",
      capacity: "20Gi", // 가정된 값
      accessMode: "ReadWriteMany", // 가정된 값
      reclaimPolicy: "Retain", // 가정된 값
      status: "Running",
      labels: "controller-revision-hash=7489b54556,k8s-app=calico-node,pod-template-generation=1",
    },
    {
      name: "coredns-76f75df574-tpdg5",
      capacity: "5Gi", // 가정된 값
      accessMode: "ReadWriteOnce", // 가정된 값
      reclaimPolicy: "Delete", // 가정된 값
      status: "Running",
      labels: "k8s-app=kube-dns,pod-template-hash=76f75df574",
    },
    {
      name: "coredns-76f75df574-x72z8",
      capacity: "5Gi", // 가정된 값
      accessMode: "ReadWriteOnce", // 가정된 값
      reclaimPolicy: "Delete", // 가정된 값
      status: "Running",
      labels: "k8s-app=kube-dns,pod-template-hash=76f75df574",
    },
    {
      name: "etcd-master",
      capacity: "30Gi", // 가정된 값
      accessMode: "ReadWriteOnce", // 가정된 값
      reclaimPolicy: "Retain", // 가정된 값
      status: "Running",
      labels: "component=etcd,tier=control-plane",
    },
    {
      name: "kube-apiserver-master",
      capacity: "25Gi", // 가정된 값
      accessMode: "ReadWriteOnce", // 가정된 값
      reclaimPolicy: "Retain", // 가정된 값
      status: "Running",
      labels: "component=kube-apiserver,tier=control-plane",
    },
    {
      name: "kube-controller-manager-master",
      capacity: "25Gi", // 가정된 값
      accessMode: "ReadWriteOnce", // 가정된 값
      reclaimPolicy: "Retain", // 가정된 값
      status: "Running",
      labels: "component=kube-controller-manager,tier=control-plane",
    },
    {
      name: "kube-proxy-ml8kc",
      capacity: "10Gi", // 가정된 값
      accessMode: "ReadWriteOnce", // 가정된 값
      reclaimPolicy: "Delete", // 가정된 값
      status: "Running",
      labels: "controller-revision-hash=5fbd756bc7,k8s-app=kube-proxy,pod-template-generation=1",
    },
    {
      name: "kube-proxy-nrtqv",
      capacity: "10Gi", // 가정된 값
      accessMode: "ReadWriteOnce", // 가정된 값
      reclaimPolicy: "Delete", // 가정된 값
      status: "Running",
      labels: "controller-revision-hash=5fbd756bc7,k8s-app=kube-proxy,pod-template-generation=1",
    },
    {
      name: "kube-scheduler-master",
      capacity: "15Gi", // 가정된 값
      accessMode: "ReadWriteMany", // 가정된 값
      reclaimPolicy: "Retain", // 가정된 값
      status: "Running",
      labels: "component=kube-scheduler,tier=control-plane",
    },
  ];
  

const statusColors = {
  Stop: "badge-stop",
  Running: "badge-running",
  Pending: "badge-pending",
};

export const Volume = () => {
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
      <div className="main-content">
        <Navbar />
        <div className="event-content">
          <div className="event-header">
            <h2>Resources-Volume</h2>
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
                      <th>CAPACITY</th>
                      <th>ACCESS MODE</th>
                      <th>RECLAIM POLICY</th>
                      <th>STATUS</th>
                      <th>LABLES</th>
                    </tr>
                  </CDBTableHeader>
                  <CDBTableBody>
                    {currentPageData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.name}</td>
                        <td>{row.capacity}</td>
                        <td>{row.accessMode}</td>
                        <td>{row.reclaimPolicy}%</td>
                        <td>{row.status}%</td>
                        <td>{row.labels}%</td>
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
            <footer className="footer">
              <div className="d-flex align-items-center"></div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
