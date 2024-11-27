import React, { useEffect, useState } from "react";
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

export const Deployment = () => {
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const {
    data: deploys,
    isLoading: loadingDeploys,
    error: errorDeploys,
  } = useQuery("deploys", () =>
    fetchData("http://localhost:8080/v1/deployments")
  );
  confirm(loadingDeploys, errorDeploys);

  // 상태 업데이트: 로딩 중에도 이전 데이터를 유지
  const openDetailPopup = async (row) => {
    setIsDetailPopupOpen(true); // 팝업 열기
    setLoadingDetail(true); // 로딩 시작

    try {
      const detailUrl = `http://localhost:8080/v1/deployments/${row.namespace}/${row.name}`;
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

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  // 검색 필터링
  const filteredData = deploys
    ? deploys.filter((deploy) =>
        deploy.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h2>Deployment</h2>
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
                      <Square15 topLeftText="Name Space">
                        {selectedRow.namespace}
                      </Square15>
                      <Square15 topLeftText="Replicas">
                        {selectedRow.replicas}
                      </Square15>
                      <Square15 topLeftText="Available">
                        {selectedRow.available}
                      </Square15>
                      <Square15 topLeftText="Updated">
                        {selectedRow.updated}
                      </Square15>
                      <Square15 topLeftText="Ready">
                        {selectedRow.ready}
                      </Square15>
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
                          "<none>"
                        )}
                      </Square4>
                      <Square4 topLeftText="Creation Time">
                        <td>
                          {selectedRow.creation_time
                            ? new Date(selectedRow.creation_time).toUTCString()
                            : ""}
                        </td>
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
