import React, { useEffect, useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "../Node/Node.css";
import "./Resources.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Square15, Square4 } from "../Node/Squares";

const sampleData = [
  {
    name: "deployment-1",
    namespace: "default",
    replicas: 3,
    available: 2,
    updated: 3,
    ready: 2,
    labels: { app: "nginx", tier: "frontend" },
    creation_time: "2024-11-20T10:00:00Z",
  },
  {
    name: "deployment-2",
    namespace: "kube-system",
    replicas: 2,
    available: 1,
    updated: 2,
    ready: 1,
    labels: { app: "nginx", tier: "backend" },
    creation_time: "2024-11-19T08:30:00Z",
  },
  {
    name: "deployment-3",
    namespace: "default",
    replicas: 4,
    available: 3,
    updated: 4,
    ready: 3,
    labels: { app: "flask", tier: "api" },
    creation_time: "2024-11-18T12:15:00Z",
  },
  {
    name: "deployment-4",
    namespace: "default",
    replicas: 5,
    available: 4,
    updated: 5,
    ready: 4,
    labels: { app: "react", tier: "frontend" },
    creation_time: "2024-11-17T15:45:00Z",
  },
  {
    name: "deployment-5",
    namespace: "kube-system",
    replicas: 3,
    available: 2,
    updated: 3,
    ready: 2,
    labels: { app: "express", tier: "backend" },
    creation_time: "2024-11-16T09:00:00Z",
  },
  {
    name: "deployment-6",
    namespace: "default",
    replicas: 6,
    available: 5,
    updated: 6,
    ready: 5,
    labels: { app: "vue", tier: "frontend" },
    creation_time: "2024-11-15T10:00:00Z",
  },
  {
    name: "deployment-7",
    namespace: "default",
    replicas: 2,
    available: 2,
    updated: 2,
    ready: 2,
    labels: { app: "django", tier: "api" },
    creation_time: "2024-11-14T14:00:00Z",
  },
  {
    name: "deployment-8",
    namespace: "kube-system",
    replicas: 4,
    available: 4,
    updated: 4,
    ready: 4,
    labels: { app: "flask", tier: "backend" },
    creation_time: "2024-11-13T11:30:00Z",
  },
  {
    name: "deployment-9",
    namespace: "default",
    replicas: 3,
    available: 2,
    updated: 3,
    ready: 2,
    labels: { app: "nodejs", tier: "frontend" },
    creation_time: "2024-11-12T08:45:00Z",
  },
  {
    name: "deployment-10",
    namespace: "default",
    replicas: 2,
    available: 2,
    updated: 2,
    ready: 2,
    labels: { app: "spring", tier: "api" },
    creation_time: "2024-11-11T13:00:00Z",
  },
];

export const Deployment = () => {
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [statefulSetDetails, setStatefulSetDetails] = useState([]);
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [checkboxes, setCheckboxes] = useState([
    { id: 1, label: "default", isChecked: false },
    { id: 2, label: "kube-system", isChecked: false },
    { id: 3, label: "production", isChecked: false },
    { id: 4, label: "staging", isChecked: false },
  ]);

  useEffect(() => {
    // 초기화 시 샘플 데이터를 사용
    setStatefulSetDetails(sampleData);
  }, []);

  const openDetailPopup = (row) => {
    setSelectedRow(row);
    setIsDetailPopupOpen(true);
  };

  const closeDetailPopup = () => {
    setIsDetailPopupOpen(false);
  };

  const openPopup = () => {
    setFilterPopupOpen(true);
  };

  const closePopup = () => {
    setFilterPopupOpen(false);
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

  const filteredData = statefulSetDetails.filter((item) => {
    const matchesSearchTerm = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const activeFilters = getActiveFilters();
    const matchesFilters =
      activeFilters.length === 0 || activeFilters.includes(item.namespace);
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
            <h2>Deployment</h2>
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
                        filter //필터 상자
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
                  <button onClick={openPopup} className="button">
                    Filter
                  </button>
                </div>
                <CDBTable responsive>
                  <CDBTableHeader>
                    <tr className="table-header">
                      <th>NAME</th>
                      <th>NAMESPACE</th>
                      <th>REPLICAS</th>
                      <th>AVAILABLE</th>
                      <th>LABELS</th>
                    </tr>
                  </CDBTableHeader>
                  <CDBTableBody>
                    {currentPageData.map((row, index) => (
                      <tr key={index} onClick={() => openDetailPopup(row)}>
                        <td className="table-cell-ellipsis">{row.name}</td>
                        <td className="table-cell-ellipsis">{row.namespace}</td>
                        <td className="table-cell-ellipsis">{row.replicas}</td>
                        <td className="table-cell-ellipsis">{row.available}</td>
                        <td className="table-cell-ellipsis">
                          {row.labels
                            ? Object.entries(row.labels)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(", ")
                            : "<none>"}
                        </td>
                      </tr>
                    ))}
                  </CDBTableBody>
                </CDBTable>

                <div className="pagination-container">
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

            {filterPopupOpen && (
              <div className="popup">
                <h2>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="close-button"
                    onClick={closePopup}
                  />
                  Select Filters
                </h2>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      checked={isSelectAllChecked}
                      onChange={handleSelectAllChange}
                    />
                    Select All
                  </label>
                  {checkboxes.map((checkbox) => (
                    <label key={checkbox.id}>
                      <input
                        type="checkbox"
                        checked={checkbox.isChecked}
                        onChange={() => handleCheckboxChange(checkbox.id)}
                      />
                      {checkbox.label}
                    </label>
                  ))}
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
                  <Square15 topLeftText="Name Space">
                    {selectedRow.namespace}
                  </Square15>
                  <Square15 topLeftText="Replicas">
                    {selectedRow.replicas}
                  </Square15>
                  <Square15 topLeftText="Available">
                    {selectedRow.available}
                  </Square15>
                  <Square15 topLeftText="Updated">{selectedRow.updated}</Square15>
                  <Square15 topLeftText="Ready">{selectedRow.ready}</Square15>
                  <Square4 topLeftText="Labels">
                    {selectedRow.labels
                      ? Object.entries(selectedRow.labels)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")
                      : ""}
                  </Square4>
                  <Square4 topLeftText="Creation Time">
                    {" "}
                    {/* 한글로 시간 출력되게 하려면 아래와 같이 하고 Square4 쓸 것 */}
                    {selectedRow.creation_time
                      ? new Date(selectedRow.creation_time).toLocaleString()
                      : ""}
                  </Square4>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
