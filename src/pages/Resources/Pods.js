import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "../Node/Node.css";
import "./Resources.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Square1_5, Square4 } from "../Node/Squares";
import { fetchData, confirm } from "../Utils";

const statusColors = {
  Stop: "badge-stop",
  Running: "badge-running",
  Pending: "badge-pending",
};

export const Pods = () => {
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [filterPopupOpen, setFilterPopupOpen] = useState(false); // 필터 팝업 상태
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false); // 디테일 팝업 상태
  const [podDetails, setPodDetails] = useState([]);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [checkboxes, setCheckboxes] = useState([
    { id: 1, label: "nginx", isChecked: false },
    { id: 2, label: "kube", isChecked: false },
    { id: 3, label: "etcd", isChecked: false },
    // 체크박스 추가
  ]);
  const {
    data: pods,
    isLoading: loadingPods,
    error: errorPods,
  } = useQuery("pods", () => fetchData("http://localhost:8080/v1/pods"));
  confirm(loadingPods, errorPods);

  useEffect(() => {
    if (!pods || pods.length === 0) return;

    const fetchPodMetrics = async () => {
      // Fetch detailed metrics for each pod
      const podMetricsPromises = pods.map(async (pod) => {
        const podMetricsUrl = `http://localhost:8080/v1/pods/${pod.namespace}/${pod.name}`;
        const podMetrics = await fetchData(podMetricsUrl);
        return {
          ...pod,
          cpu_usage: podMetrics.cpu_usage || 0, // Add default values if needed
          mem_usage: podMetrics.mem_usage || 0,
          node_name: podMetrics.node_name,
          start_time: podMetrics.start_time,
          volumes: podMetrics.volumes,
        };
      });

      // Wait for all metrics to be fetched
      const updatedPods = await Promise.all(podMetricsPromises);
      setPodDetails(updatedPods); // Store the updated pod details with metrics
    };

    fetchPodMetrics();
  }, [pods]);

  if (loadingPods) return <p>Loading pods...</p>;
  if (errorPods) return <p>Error loading pods.</p>;

  const openPopup = () => {
    setFilterPopupOpen(true);
  };
  const closePopup = () => {
    setFilterPopupOpen(false);
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

  const filteredData = podDetails.filter((item) => {
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
            <h2>Resources-Pods</h2>
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
                      <th>IP</th>
                      <th>STATUS</th>
                      <th>LABELS</th>
                      <th>RESTARTS</th>
                    </tr>
                  </CDBTableHeader>
                  <CDBTableBody>
                    {currentPageData.map((row, index) => (
                      <tr key={index} onClick={() => openDetailPopup(row)}>
                        <td>{row.name}</td>
                        <td>{row.namespace}</td>
                        <td>{row.ip}</td>
                        <td>
                          <span className={`badge ${statusColors[row.status]}`}>
                            {row.status}
                          </span>
                        </td>
                        <td>
                          {row.labels
                            ? Object.entries(row.labels).map(
                                ([key, value], i) => (
                                  <span key={i}>
                                    {key}: {value}
                                    {i < Object.entries(row.labels).length - 1
                                      ? ", "
                                      : ""}
                                  </span>
                                )
                              )
                            : "<none>"}
                        </td>
                        <td>{row.restarts}</td>
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
                  <Square1_5 topLeftText="IP">{selectedRow.ip}</Square1_5>
                  <Square1_5 topLeftText="Status">
                    {selectedRow.status}
                  </Square1_5>
                  <Square1_5 topLeftText="Restarts">
                    {selectedRow.restarts}
                  </Square1_5>
                  <Square1_5 topLeftText="Node Name">
                    {selectedRow.node_name}
                  </Square1_5>
                  <Square1_5 topLeftText="Start Time">
                    {selectedRow.start_time}
                  </Square1_5>
                  <Square4 topLeftText="Images">
                    {Array.isArray(selectedRow.images)
                      ? selectedRow.images.join(", ")
                      : selectedRow.images}
                  </Square4>
                  <Square4 topLeftText="Labels">
                    {selectedRow.labels
                      ? Object.entries(selectedRow.labels)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")
                      : ""}
                  </Square4>
                  <Square4 topLeftText="Volumes">
                    {Array.isArray(selectedRow.volumes)
                      ? selectedRow.volumes.join(", ")
                      : selectedRow.volumes}
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
