import React, { useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "../Node/Node.css";
import "./Resources.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Square1, Square15, Square2, Square3, Square4 } from "../Node/Squares";

// 샘플 데이터
const jobData = [
  {
    name: "job-1",
    namespace: "default",
    completions: 1,
    active: 0,
    failed: 0,
    labels: { app: "example", tier: "backend" },
    creation_time: "2024-11-18T10:00:00Z",
  },
  {
    name: "job-2",
    namespace: "kube-system",
    completions: 2,
    active: 1,
    failed: 0,
    labels: { task: "backup", environment: "production" },
    creation_time: "2024-11-17T14:30:00Z",
  },
  {
    name: "job-3",
    namespace: "development",
    completions: 0,
    active: 1,
    failed: 2,
    labels: { project: "api-service", version: "v1.2" },
    creation_time: "2024-11-16T09:45:00Z",
  },
  {
    name: "job-4",
    namespace: "default",
    completions: 3,
    active: 0,
    failed: 1,
    labels: { type: "analytics", priority: "high" },
    creation_time: "2024-11-15T11:15:00Z",
  },
  {
    name: "job-5",
    namespace: "monitoring",
    completions: 5,
    active: 0,
    failed: 0,
    labels: { tool: "prometheus", team: "devops" },
    creation_time: "2024-11-14T16:20:00Z",
  },
  {
    name: "job-6",
    namespace: "default",
    completions: 1,
    active: 1,
    failed: 0,
    labels: { role: "worker", region: "us-east" },
    creation_time: "2024-11-13T12:00:00Z",
  },
  {
    name: "job-7",
    namespace: "production",
    completions: 2,
    active: 0,
    failed: 1,
    labels: { "job-type": "data-processing", scale: "large" },
    creation_time: "2024-11-12T18:45:00Z",
  },
  {
    name: "job-8",
    namespace: "analytics",
    completions: 0,
    active: 3,
    failed: 0,
    labels: { task: "aggregation", priority: "low" },
    creation_time: "2024-11-11T15:30:00Z",
  },
  {
    name: "job-9",
    namespace: "default",
    completions: 4,
    active: 0,
    failed: 2,
    labels: { component: "database", critical: "true" },
    creation_time: "2024-11-10T10:15:00Z",
  },
  {
    name: "job-10",
    namespace: "qa",
    completions: 2,
    active: 0,
    failed: 1,
    labels: { stage: "testing", team: "qa" },
    creation_time: "2024-11-09T08:45:00Z",
  },
  {
    name: "job-11",
    namespace: "default",
    completions: 1,
    active: 1,
    failed: 0,
    labels: { project: "frontend", framework: "react" },
    creation_time: "2024-11-08T13:15:00Z",
  },
  {
    name: "job-12",
    namespace: "staging",
    completions: 3,
    active: 0,
    failed: 0,
    labels: { version: "beta", release: "candidate" },
    creation_time: "2024-11-07T16:30:00Z",
  },
  {
    name: "job-13",
    namespace: "production",
    completions: 0,
    active: 2,
    failed: 0,
    labels: { task: "compression", cost: "medium" },
    creation_time: "2024-11-06T14:00:00Z",
  },
  {
    name: "job-14",
    namespace: "testing",
    completions: 5,
    active: 0,
    failed: 0,
    labels: { "ci-tool": "jenkins", platform: "linux" },
    creation_time: "2024-11-05T09:45:00Z",
  },
  {
    name: "job-15",
    namespace: "development",
    completions: 1,
    active: 0,
    failed: 3,
    labels: { deployment: "blue-green", environment: "dev" },
    creation_time: "2024-11-04T18:15:00Z",
  },
  {
    name: "job-16",
    namespace: "monitoring",
    completions: 4,
    active: 0,
    failed: 0,
    labels: { service: "grafana", team: "ops" },
    creation_time: "2024-11-03T11:30:00Z",
  },
  {
    name: "job-17",
    namespace: "default",
    completions: 2,
    active: 1,
    failed: 0,
    labels: { priority: "medium", node: "worker-1" },
    creation_time: "2024-11-02T10:00:00Z",
  },
  {
    name: "job-18",
    namespace: "kube-system",
    completions: 3,
    active: 0,
    failed: 1,
    labels: { role: "scheduler", cluster: "prod-cluster" },
    creation_time: "2024-11-01T14:45:00Z",
  },
  {
    name: "job-19",
    namespace: "development",
    completions: 0,
    active: 2,
    failed: 1,
    labels: { type: "worker", availability: "high" },
    creation_time: "2024-10-31T12:30:00Z",
  },
  {
    name: "job-20",
    namespace: "default",
    completions: 6,
    active: 0,
    failed: 0,
    labels: { deployment: "canary", strategy: "rollout" },
    creation_time: "2024-10-30T10:00:00Z",
  },
];

const cronJobData = [
  {
    name: "cronjob-1",
    namespace: "default",
    schedule: "*/5 * * * *",
    labels: { task: "sync", environment: "production" },
    creation_time: "2024-11-18T10:00:00Z",
  },
  {
    name: "cronjob-2",
    namespace: "monitoring",
    schedule: "0 0 * * 0",
    labels: { app: "monitoring", team: "ops" },
    creation_time: "2024-11-17T14:30:00Z",
  },
];

const statusColors = {
  Stop: "badge-stop",
  Running: "badge-running",
  Pending: "badge-pending",
};

export const Job = () => {
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState(jobData);
  const [dataType, setDataType] = useState("Job");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 필터 팝업 상태
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false); // 디테일 팝업 상태

  // 데이터 타입 변경 핸들러
  const handleDataTypeChange = (type) => {
    setDataType(type);
    if (type === "Job") setCurrentData(jobData);
    if (type === "CronJob") setCurrentData(cronJobData);
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
            <h2>Resources-Job</h2>
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
                    onClick={() => handleDataTypeChange("Job")}
                    className={`data-type-button ${
                      dataType === "Job" ? "data-type-active" : ""
                    }`}
                  >
                    Job
                  </button>
                  <button
                    onClick={() => handleDataTypeChange("CronJob")}
                    className={`data-type-button ${
                      dataType === "CronJob" ? "data-type-active" : ""
                    }`}
                  >
                    CronJob
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
                      {dataType === "Job" && (
                        <>
                          <th>NAME</th>
                          <th>NAMESPACE</th>
                          <th>COMPLETIONS</th>
                          <th>LABELS</th>
                        </>
                      )}
                      {dataType === "CronJob" && (
                        <>
                          <th>NAME</th>
                          <th>NAMESPACE</th>
                          <th>Schedule</th>
                          <th>LABELS</th>
                        </>
                      )}
                    </tr>
                  </CDBTableHeader>
                  <CDBTableBody>
                    {currentPageData.map((row, index) => (
                      <tr key={index} onClick={() => openDetailPopup(row)}>
                        {dataType === "Job" && (
                          <>
                            <td className="table-cell-ellipsis">{row.name}</td>
                            <td className="table-cell-ellipsis">
                              {row.namespace}
                            </td>
                            <td className="table-cell-ellipsis">
                              {row.completions}
                            </td>
                            <td className="table-cell-ellipsis">
                              {JSON.stringify(row.labels)}
                            </td>
                          </>
                        )}
                        {dataType === "CronJob" && (
                          <>
                            <td className="table-cell-ellipsis">{row.name}</td>
                            <td className="table-cell-ellipsis">
                              {row.namespace}
                            </td>
                            <td className="table-cell-ellipsis">
                              {row.schedule}
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
                  {dataType === "Job" && selectedRow && (
                    <>
                      <Square15 topLeftText="Namespace">
                        {selectedRow.namespace}
                      </Square15>
                      <Square15 topLeftText="Completions">
                        {selectedRow.completions}
                      </Square15>
                      <Square15 topLeftText="Active">
                        {selectedRow.active}
                      </Square15>
                      <Square15 topLeftText="Failed">
                        {selectedRow.failed}
                      </Square15>
                      <Square15 topLeftText="Creation Time">
                        {selectedRow.creation_time}
                      </Square15>
                      <Square4 topLeftText="Labels">
                        {selectedRow.labels
                          ? Object.entries(selectedRow.labels)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")
                          : ""}
                      </Square4>
                    </>
                  )}

                  {dataType === "CronJob" && selectedRow && (
                    <>
                      <Square15 topLeftText="Name">
                        {selectedRow.name}
                      </Square15>
                      <Square15 topLeftText="Namespace">
                        {selectedRow.namespace}
                      </Square15>
                      <Square15 topLeftText="Schedule">
                        {selectedRow.schedule}
                      </Square15>
                      <Square15 topLeftText="Creation Time">
                        {selectedRow.creation_time}
                      </Square15>
                      <Square4 topLeftText="Labels">
                        {selectedRow.labels
                          ? Object.entries(selectedRow.labels)
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
