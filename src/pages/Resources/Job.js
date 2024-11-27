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
  const [dataType, setDataType] = useState("Job");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false); // 디테일 팝업 상태
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [data, setData] = useState([]);

  const {
    data: jobs,
    isLoading: loadingJobs,
    error: errorJobs,
  } = useQuery("jobs", () => fetchData("http://localhost:8080/v1/jobs"), {
    enabled: dataType === "Job",
  });
  confirm(loadingJobs, errorJobs);

  const {
    data: cronjobs,
    isLoading: loadingCronjobs,
    error: errorCronjobs,
  } = useQuery(
    "cronjobs",
    () => fetchData("http://localhost:8080/v1/cronjobs"),
    {
      enabled: dataType === "CronJob",
    }
  );
  confirm(loadingCronjobs, errorCronjobs);

  // 상태 업데이트: 로딩 중에도 이전 데이터를 유지
  const openDetailPopup = async (row) => {
    setIsDetailPopupOpen(true); // 팝업 열기
    setLoadingDetail(true); // 로딩 시작
    if (dataType == "Job") {
      try {
        const detailUrl = `http://localhost:8080/v1/jobs/${row.namespace}/${row.name}`;
        const detailData = await fetchData(detailUrl);

        // 로딩 중에도 이전 데이터를 덮어씌우지 않음
        setSelectedRow((prev) => ({
          ...prev,
          ...row,
          ...detailData,
        }));
      } catch (error) {
        console.error("Error fetching jobs details:", error);
      } finally {
        setLoadingDetail(false); // 로딩 종료
      }
    }
    if (dataType == "CronJob") {
      try {
        const detailUrl = `http://localhost:8080/v1/cronjobs/${row.namespace}/${row.name}`;
        const detailData = await fetchData(detailUrl);

        // 로딩 중에도 이전 데이터를 덮어씌우지 않음
        setSelectedRow((prev) => ({
          ...prev,
          ...row,
          ...detailData,
        }));
      } catch (error) {
        console.error("Error fetching cronjobs details:", error);
      } finally {
        setLoadingDetail(false); // 로딩 종료
      }
    }
  };

  useEffect(() => {
    // 초기 데이터 설정
    if (dataType === "Job" && jobs) {
      setData(jobs);
    } else if (dataType === "CronJob" && cronjobs) {
      setData(cronjobs);
    }
  }, [dataType, jobs, cronjobs]);

  const handleDataTypeChange = (type) => {
    setDataType(type); // 데이터 타입 변경
    setSearchTerm(""); // 검색어 초기화
    setCurrentPage(1); // 페이지 초기화

    // 데이터 동기화
    if (type === "Job" && jobs) {
      setData(jobs);
    } else if (type === "CronJob" && cronjobs) {
      setData(cronjobs);
    }
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

  const closeDetailPopup = () => {
    setIsDetailPopupOpen(false);
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  // 검색 필터링
  const filteredData = data
    ? data.filter((d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
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
                  <input // 검색창
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="search-input-resources"
                  />
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

            {isDetailPopupOpen && (
              <div className={`popup ${isDetailPopupOpen ? "open" : ""}`}>
                <h2>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="close-button"
                    onClick={closeDetailPopup}
                  />
                  {selectedRow?.name || "Loading..."}
                </h2>
                <div
                  className={`popup-content ${loadingDetail ? "loading" : ""}`}
                >
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
                      <Square4 topLeftText="Creation Time">
                        <td>
                          {selectedRow.creation_time
                            ? new Date(selectedRow.creation_time).toUTCString()
                            : ""}
                        </td>
                      </Square4>
                      <Square4 topLeftText="Labels">
                        {selectedRow.labels ? (
                          <ul className="labels-list">
                            {Object.entries(selectedRow.labels).map(
                              ([key, value], index) => (
                                <li key={index}>
                                  <strong>{key}</strong>: {value || "<none>"}
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          "N/A"
                        )}
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
                      <Square4 topLeftText="Creation Time">
                        {selectedRow.creation_time
                          ? new Date(selectedRow.creation_time).toUTCString()
                          : "<none>"}
                      </Square4>
                      <Square4 topLeftText="Labels">
                        {selectedRow.labels ? (
                          <ul className="labels-list">
                            {Object.entries(selectedRow.labels).map(
                              ([key, value], index) => (
                                <li key={index}>
                                  <strong>{key}</strong>: {value || "<none>"}
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          "N/A"
                        )}
                      </Square4>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
