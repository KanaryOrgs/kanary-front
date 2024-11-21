import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "../Node/Node.css";
import "./Resources.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Square15, Square4 } from "../Node/Squares";
import { fetchData, confirm } from "../Utils";

export const Job = () => {
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [dataType, setDataType] = useState("Job");
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
  const {
    data: jobs,
    isLoading: loadingJobs,
    error: errorJobs,
    refetch: refetchJobs,
  } = useQuery("jobs", () => fetchData("http://localhost:8080/v1/jobs"), {
    enabled: dataType === "Job", // PersistentVolume일 때만 실행
  });
  confirm(loadingJobs, errorJobs);

  const {
    data: cronjobs,
    isLoading: loadingCronjobs,
    error: errorCronjobs,
    refetch: refetchCronjobs,
  } = useQuery(
    "cronjobs",
    () => fetchData("http://localhost:8080/v1/cronjobs"),
    {
      enabled: dataType === "CronJob", // PersistentVolume일 때만 실행
    }
  );
  confirm(loadingCronjobs, errorCronjobs);

  // Job
  useEffect(() => {
    // 데이터 타입이 PersistentVolume이 아닌 경우 early return
    if (dataType !== "Job") return;

    // 데이터가 없거나 로딩 중이면 실행하지 않음
    if (!jobs || jobs.length === 0) {
      refetchJobs(); // 데이터를 다시 가져오기 위해 refetch 호출
      return;
    }

    const fetchJobMetrics = async () => {
      // Fetch detailed metrics for each pod
      const jobsMetricsPromises = jobs.map(async (job) => {
        const jobsMetricsUrl = `http://localhost:8080/v1/jobs/${job.namespace}/${job.name}`;
        const jobsMetrics = await fetchData(jobsMetricsUrl);
        return {
          ...job,
          creation_time: jobsMetrics.creation_time,
          active: jobsMetrics.active,
          failed: jobsMetrics.failed,
        };
      });

      // Wait for all metrics to be fetched
      const updatedJobs = await Promise.all(jobsMetricsPromises);
      setCurrentData(updatedJobs); // Store the updated pod details with metrics
    };

    fetchJobMetrics();
  }, [dataType, jobs, refetchJobs]);

  // CronJob
  useEffect(() => {
    // 데이터 타입이 PersistentVolume이 아닌 경우 early return
    if (dataType !== "CronJob") return;

    // 데이터가 없거나 로딩 중이면 실행하지 않음
    if (!cronjobs || cronjobs.length === 0) {
      refetchCronjobs(); // 데이터를 다시 가져오기 위해 refetch 호출
      return;
    }

    const fetchCronMetrics = async () => {
      // Fetch detailed metrics for each pod
      const cronMetricsPromises = cronjobs.map(async (cron) => {
        const cronMetricsUrl = `http://localhost:8080/v1/cronjobs/${cron.namespace}/${cron.name}`;
        const cronMetrics = await fetchData(cronMetricsUrl);
        return {
          ...cron,
          creation_time: cronMetrics.creation_time,
        };
      });

      // Wait for all metrics to be fetched
      const updatedCrons = await Promise.all(cronMetricsPromises);
      setCurrentData(updatedCrons); // Store the updated pod details with metrics
    };

    fetchCronMetrics();
  }, [dataType, cronjobs, refetchCronjobs]);

  // 데이터 타입 변경 핸들러
  const handleDataTypeChange = (type) => {
    setDataType(type);
    if (type === "Job") setCurrentData(jobs);
    if (type === "CronJob") setCurrentData(cronjobs);
    setSearchTerm(""); // 검색어 초기화
  };

  if (
    (dataType === "Job" && loadingJobs) ||
    (dataType === "CronJob" && loadingCronjobs)
  )
    return <p>Loading...</p>;

  if (
    (dataType === "Job" && errorJobs) ||
    (dataType === "CronJob" && errorCronjobs)
  )
    return <p>Error loading data.</p>;

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

  const filteredData = currentData
    ? currentData.filter((item) => {
        const matchesSearchTerm = item.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const activeFilters = getActiveFilters();
        const matchesFilters =
          activeFilters.length === 0 ||
          activeFilters.every((filter) => item.name.includes(filter));
        return matchesSearchTerm && matchesFilters;
      })
    : [];

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
            <h2>Job</h2>
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
                          <th>SCHEDULE</th>
                          <th>LABELS</th>
                          <th>CREATION TIME</th>
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
                              {row.labels
                                ? Object.entries(row.labels)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(", ")
                                : "<none>"}
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
                              {row.labels
                                ? Object.entries(row.labels)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(", ")
                                : "<none>"}
                            </td>
                            <td className="table-cell-ellipsis">
                              {row.creation_time}
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
                          : "<none>"}
                      </Square4>
                    </>
                  )}

                  {dataType === "CronJob" && selectedRow && (
                    <>
                      <Square15 topLeftText="Name">{selectedRow.name}</Square15>
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
                          : "<none>"}
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
