import React, { useState } from "react";
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

const statusColors = {
  Stop: "badge-stop",
  Running: "badge-running",
  Pending: "badge-pending",
  Succeeded: "badge-succeeded",
};

export const Pods = () => {
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // useQuery로 Pod 데이터 가져오기
  const {
    data: pods,
    isLoading: loadingPods,
    error: errorPods,
  } = useQuery("pods", () => fetchData("http://localhost:8080/v1/pods"));
  confirm(loadingPods, errorPods);

  if (loadingPods) return <p>Loading pods...</p>;
  if (errorPods) return <p>Error loading pods.</p>;

  // 상태 업데이트: 로딩 중에도 이전 데이터를 유지
  const openDetailPopup = async (row) => {
    setIsDetailPopupOpen(true); // 팝업 열기
    setLoadingDetail(true); // 로딩 시작

    try {
      const detailUrl = `http://localhost:8080/v1/pods/${row.namespace}/${row.name}`;
      const detailData = await fetchData(detailUrl);

      // 로딩 중에도 이전 데이터를 덮어씌우지 않음
      setSelectedRow((prev) => ({
        ...prev,
        ...row,
        ...detailData,
      }));
    } catch (error) {
      console.error("Error fetching pod details:", error);
    } finally {
      setLoadingDetail(false); // 로딩 종료
    }
  };

  const closeDetailPopup = () => {
    setIsDetailPopupOpen(false);
    setSelectedRow(null);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // 검색 필터링
  const filteredData = pods.filter((pod) =>
    pod.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이징 처리
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredData.length);
  const currentPageData = filteredData.slice(startIndex, endIndex);

  const goToPage = (page) => setCurrentPage(page);

  return (
    <div className="d-flex E">
      <div>
        <Sidebar />
      </div>
      <div className="main-content">
        <Navbar />
        <div className="event-content">
          <div className="event-header">
            <h2>Pods</h2>
            <p>Kubernetes Cluster Resources</p>
          </div>
        </div>

        <div className="node-container">
          <div className="content-wrapper">
            <div className="grid-wrapper">
              <div className="mt-5">
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
                        <td>{row.ip || "<none>"}</td>
                        <td>
                          <span className={`badge ${statusColors[row.status]}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="table-cell-ellipsis">
                          {row.labels
                            ? Object.entries(row.labels)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(", ")
                            : "<none>"}
                        </td>
                        <td>{row.restarts}</td>
                      </tr>
                    ))}
                  </CDBTableBody>
                </CDBTable>

                {/* 페이지 버튼 */}
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
            {/* Detail Popup */}
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
                  {loadingDetail ? (
                    <p>Loading details...</p>
                  ) : selectedRow ? (
                    <>
                      <Square15 topLeftText="Namespace">
                        {selectedRow.namespace}
                      </Square15>
                      <Square15 topLeftText="IP">
                        {selectedRow.ip || "<none>"}
                      </Square15>
                      <Square15 topLeftText="Status">
                        {selectedRow.status}
                      </Square15>
                      <Square15 topLeftText="CPU Usage">
                        {selectedRow.cpu_usage
                          ? ((selectedRow.cpu_usage / 48) * 100).toFixed(2)
                          : "0"}
                        %
                      </Square15>
                      <Square15 topLeftText="Memory Usage">
                        {selectedRow.mem_usage
                          ? ((selectedRow.mem_usage / 305) * 100).toFixed(2)
                          : "0"}
                        %
                      </Square15>
                      <Square15 topLeftText="Node Name">
                        {selectedRow.node_name || "N/A"}
                      </Square15>
                      <Square4 topLeftText="Start Time">
                        {selectedRow.start_time
                          ? new Date(selectedRow.start_time).toUTCString()
                          : "N/A"}
                      </Square4>
                      <Square4 topLeftText="Volumes">
                        {Array.isArray(selectedRow.volumes)
                          ? selectedRow.volumes.join(", ")
                          : "N/A"}
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
                  ) : (
                    <p>No data available.</p>
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
