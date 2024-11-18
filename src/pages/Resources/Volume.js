import React, { useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "../Node/Node.css";
import "./Resources.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Square1, Square1_5, Square2, Square3, Square4 } from "../Node/Squares";

// 샘플 데이터
const persistentVolumeData = [
  {
    name: "nginx-pv",
    capacity: { storage: "10Gi" },
    accessModes: ["ReadWriteOnce"],
    reclaimPolicy: "Retain",
    status: "Running",
    labels: { app: "nginx" },
    creationTime: "2023-08-10T14:12:03Z",
    storageClass: "standard",
  },
  {
    name: "httpbin-pv",
    capacity: { storage: "5Gi" },
    accessModes: ["ReadWriteOnce"],
    reclaimPolicy: "Delete",
    status: "Pending",
    labels: { app: "httpbin" },
    creationTime: "2023-07-15T10:05:20Z",
    storageClass: "premium",
  },
  {
    name: "postgres-pv",
    capacity: { storage: "20Gi" },
    accessModes: ["ReadWriteMany"],
    reclaimPolicy: "Retain",
    status: "Bound",
    labels: { app: "postgres" },
    creationTime: "2023-06-01T08:25:10Z",
    storageClass: "standard",
  },
  {
    name: "redis-pv",
    capacity: { storage: "8Gi" },
    accessModes: ["ReadWriteOnce"],
    reclaimPolicy: "Delete",
    status: "Failed",
    labels: { app: "redis" },
    creationTime: "2023-09-18T12:30:45Z",
    storageClass: "fast",
  },
  {
    name: "mysql-pv",
    capacity: { storage: "15Gi" },
    accessModes: ["ReadWriteOnce"],
    reclaimPolicy: "Retain",
    status: "Released",
    labels: { app: "mysql" },
    creationTime: "2023-05-22T09:10:50Z",
    storageClass: "standard",
  },
  {
    name: "mongo-pv",
    capacity: { storage: "25Gi" },
    accessModes: ["ReadWriteMany"],
    reclaimPolicy: "Delete",
    status: "Bound",
    labels: { app: "mongo" },
    creationTime: "2023-03-12T14:50:00Z",
    storageClass: "fast",
  },
  {
    name: "cassandra-pv",
    capacity: { storage: "30Gi" },
    accessModes: ["ReadOnlyMany"],
    reclaimPolicy: "Retain",
    status: "Released",
    labels: { app: "cassandra" },
    creationTime: "2023-10-05T16:40:30Z",
    storageClass: "premium",
  },
  {
    name: "elastic-pv",
    capacity: { storage: "50Gi" },
    accessModes: ["ReadWriteOnce"],
    reclaimPolicy: "Delete",
    status: "Pending",
    labels: { app: "elastic" },
    creationTime: "2023-04-11T13:00:00Z",
    storageClass: "standard",
  },
  {
    name: "kafka-pv",
    capacity: { storage: "40Gi" },
    accessModes: ["ReadWriteMany"],
    reclaimPolicy: "Retain",
    status: "Bound",
    labels: { app: "kafka" },
    creationTime: "2023-02-08T11:15:20Z",
    storageClass: "fast",
  },
  {
    name: "rabbitmq-pv",
    capacity: { storage: "10Gi" },
    accessModes: ["ReadWriteOnce"],
    reclaimPolicy: "Delete",
    status: "Running",
    labels: { app: "rabbitmq" },
    creationTime: "2023-01-25T17:30:10Z",
    storageClass: "premium",
  },
];

const persistentVolumeClaimData = [
  {
    name: "nginx-pvc",
    namespace: "default",
    volumeName: "nginx-pv",
    accessModes: ["ReadWriteOnce"],
    status: "Bound",
    labels: { app: "nginx" },
    creationTime: "2023-08-11T14:12:03Z",
    storageRequest: { storage: "10Gi" },
  },
  {
    name: "httpbin-pvc",
    namespace: "default",
    volumeName: "httpbin-pv",
    accessModes: ["ReadWriteOnce"],
    status: "Pending",
    labels: { app: "httpbin" },
    creationTime: "2023-07-16T10:05:20Z",
    storageRequest: { storage: "5Gi" },
  },
  {
    name: "postgres-pvc",
    namespace: "database",
    volumeName: "postgres-pv",
    accessModes: ["ReadWriteMany"],
    status: "Bound",
    labels: { app: "postgres" },
    creationTime: "2023-06-02T08:25:10Z",
    storageRequest: { storage: "20Gi" },
  },
];

const storageClassData = [
  {
    name: "standard",
    provisioner: "k8s.io/minikube-hostpath",
    reclaimPolicy: "Delete",
    allowVolumeExpansion: true,
    labels: { tier: "standard" },
    creationTime: "2023-01-01T00:00:00Z",
    parameters: { type: "default" },
  },
  {
    name: "premium",
    provisioner: "k8s.io/minikube-hostpath",
    reclaimPolicy: "Retain",
    allowVolumeExpansion: false,
    labels: { tier: "premium" },
    creationTime: "2023-02-01T00:00:00Z",
    parameters: { type: "ssd" },
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
  const [currentData, setCurrentData] = useState(persistentVolumeData);
  const [dataType, setDataType] = useState("PersistentVolume");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 필터 팝업 상태
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false); // 디테일 팝업 상태

  // 데이터 타입 변경 핸들러
  const handleDataTypeChange = (type) => {
    setDataType(type);
    if (type === "PersistentVolume") setCurrentData(persistentVolumeData);
    if (type === "PersistentVolumeClaim")
      setCurrentData(persistentVolumeClaimData);
    if (type === "StorageClass") setCurrentData(storageClassData);
    setSearchTerm(""); // 검색어 초기화
  };

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

  const filteredData = currentData.filter((item) => {
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
                {/* 데이터 타입 선택 버튼 */}
                <div className="button-group">
                  <button
                    onClick={() => handleDataTypeChange("PersistentVolume")}
                    className={`data-type-button ${
                      dataType === "PersistentVolume" ? "data-type-active" : ""
                    }`}
                  >
                    Persistent Volume
                  </button>
                  <button
                    onClick={() =>
                      handleDataTypeChange("PersistentVolumeClaim")
                    }
                    className={`data-type-button ${
                      dataType === "PersistentVolumeClaim"
                        ? "data-type-active"
                        : ""
                    }`}
                  >
                    Persistent Volume Claim
                  </button>
                  <button
                    onClick={() => handleDataTypeChange("StorageClass")}
                    className={`data-type-button ${
                      dataType === "StorageClass" ? "data-type-active" : ""
                    }`}
                  >
                    Storage Class
                  </button>
                </div>
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
                      {dataType === "PersistentVolume" && (
                        <>
                          <th>NAME</th>
                          <th>CAPACITY</th>
                          <th>ACCESS MODE</th>
                          <th>RECLAIM POLICY</th>
                          <th>STATUS</th>
                          <th>LABELS</th>
                        </>
                      )}
                      {dataType === "PersistentVolumeClaim" && (
                        <>
                          <th>NAME</th>
                          <th>NAMESPACE</th>
                          <th>VOLUME NAME</th>
                          <th>ACCESS MODES</th>
                          <th>STATUS</th>
                          <th>LABELS</th>
                        </>
                      )}
                      {dataType === "StorageClass" && (
                        <>
                          <th>NAME</th>
                          <th>PROVISIONER</th>
                          <th>RECLAIM POLICY</th>
                          <th>ALLOW EXPANSION</th>
                          <th>LABELS</th>
                        </>
                      )}
                    </tr>
                  </CDBTableHeader>
                  <CDBTableBody>
                    {currentPageData.map((row, index) => (
                      <tr key={index} onClick={() => openDetailPopup(row)}>
                        <td className="table-cell-ellipsis">{row.name}</td>
                        {dataType === "PersistentVolume" && (
                          <>
                            <td className="table-cell-ellipsis">
                              {row.capacity.storage}
                            </td>
                            <td className="table-cell-ellipsis">
                              {row.accessModes.join(", ")}
                            </td>
                            <td className="table-cell-ellipsis">
                              {row.reclaimPolicy}
                            </td>
                            <td>
                              <span
                                className={`badge ${statusColors[row.status]}`}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td className="table-cell-ellipsis">
                              {JSON.stringify(row.labels)}
                            </td>
                          </>
                        )}
                        {dataType === "PersistentVolumeClaim" && (
                          <>
                            <td className="table-cell-ellipsis">
                              {row.namespace}
                            </td>
                            <td className="table-cell-ellipsis">
                              {row.volumeName}
                            </td>
                            <td className="table-cell-ellipsis">
                              {row.accessModes.join(", ")}
                            </td>
                            <td>
                              <span
                                className={`badge ${statusColors[row.status]}`}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td className="table-cell-ellipsis">
                              {JSON.stringify(row.labels)}
                            </td>
                          </>
                        )}
                        {dataType === "StorageClass" && (
                          <>
                            <td className="table-cell-ellipsis">
                              {row.provisioner}
                            </td>
                            <td className="table-cell-ellipsis">
                              {row.reclaimPolicy}
                            </td>
                            <td className="table-cell-ellipsis">
                              {row.allowVolumeExpansion ? "Yes" : "No"}
                            </td>
                            <td className="table-cell-ellipsis">
                              {JSON.stringify(row.labels)}
                            </td>
                          </>
                        )}
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
                  {dataType === "PersistentVolume" && selectedRow && (
                    <>
                      <Square1_5 topLeftText="Name">
                        {selectedRow.name}
                      </Square1_5>
                      <Square1_5 topLeftText="Capacity">
                        {selectedRow.capacity
                          ? selectedRow.capacity.storage
                          : ""}
                      </Square1_5>
                      <Square1_5 topLeftText="Access Modes">
                        {selectedRow.accessModes
                          ? selectedRow.accessModes.join(", ")
                          : ""}
                      </Square1_5>
                      <Square1_5 topLeftText="Reclaim Policy">
                        {selectedRow.reclaimPolicy}
                      </Square1_5>
                      <Square1_5 topLeftText="Status">
                        {selectedRow.status}
                      </Square1_5>
                      <Square1_5 topLeftText="Storage Class">
                        {selectedRow.storageClass}
                      </Square1_5>
                      <Square1_5 topLeftText="Creation Time">
                        {selectedRow.creationTime}
                      </Square1_5>
                      <Square4 topLeftText="Labels">
                        {selectedRow.labels
                          ? Object.entries(selectedRow.labels)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")
                          : ""}
                      </Square4>
                    </>
                  )}

                  {dataType === "PersistentVolumeClaim" && selectedRow && (
                    <>
                      <Square1_5 topLeftText="Name">
                        {selectedRow.name}
                      </Square1_5>
                      <Square1_5 topLeftText="Namespace">
                        {selectedRow.namespace}
                      </Square1_5>
                      <Square1_5 topLeftText="Volume Name">
                        {selectedRow.volumeName}
                      </Square1_5>
                      <Square1_5 topLeftText="Access Modes">
                        {selectedRow.accessModes
                          ? selectedRow.accessModes.join(", ")
                          : ""}
                      </Square1_5>
                      <Square1_5 topLeftText="Status">
                        {selectedRow.status}
                      </Square1_5>
                      <Square1_5 topLeftText="Creation Time">
                        {selectedRow.creationTime}
                      </Square1_5>
                      <Square1_5 topLeftText="Storage Request">
                        {selectedRow.storageRequest
                          ? Object.entries(selectedRow.storageRequest)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")
                          : ""}
                      </Square1_5>
                      <Square4 topLeftText="Labels">
                        {selectedRow.labels
                          ? Object.entries(selectedRow.labels)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")
                          : ""}
                      </Square4>
                    </>
                  )}

                  {dataType === "StorageClass" && selectedRow && (
                    <>
                      <Square1_5 topLeftText="Name">
                        {selectedRow.name}
                      </Square1_5>
                      <Square1_5 topLeftText="Provisioner">
                        {selectedRow.provisioner}
                      </Square1_5>
                      <Square1_5 topLeftText="Reclaim Policy">
                        {selectedRow.reclaimPolicy}
                      </Square1_5>
                      <Square1_5 topLeftText="Allow Volume Expansion">
                        {selectedRow.allowVolumeExpansion ? "Yes" : "No"}
                      </Square1_5>
                      <Square1_5 topLeftText="Creation Time">
                        {selectedRow.creationTime}
                      </Square1_5>
                      <Square4 topLeftText="Labels">
                        {selectedRow.labels
                          ? Object.entries(selectedRow.labels)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")
                          : ""}
                      </Square4>
                      <Square4 topLeftText="Parameters">
                        {selectedRow.parameters
                          ? Object.entries(selectedRow.parameters)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")
                          : ""}
                      </Square4>
                    </>
                  )}
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
