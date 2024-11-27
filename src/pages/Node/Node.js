import React, { useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "./Node.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { fetchData, confirm } from "../Utils";
import { useQuery } from "react-query";
import { Square1, Square15, Square2, Square4 } from "./Squares";

export const Node = () => {
  const pageSize = 8; // 최대 행 개수
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const {
    data: nodes,
    isLoading: loadingNodes,
    error: errorNodes,
  } = useQuery("nodes", () => fetchData("http://localhost:8080/v1/nodes"));
  confirm(loadingNodes, errorNodes);

  if (loadingNodes) return <p>Loading nodes...</p>;
  if (errorNodes) return <p>Error loading nodes.</p>;

  // 상태 업데이트: 로딩 중에도 이전 데이터를 유지
  const openDetailPopup = async (row) => {
    setIsDetailPopupOpen(true); // 팝업 열기
    setLoadingDetail(true); // 로딩 시작

    try {
      const detailUrl = `http://localhost:8080/v1/nodes/${row.name}`;
      const detailData = await fetchData(detailUrl);

      // 로딩 중에도 이전 데이터를 덮어씌우지 않음
      setSelectedRow((prev) => {
        // 데이터 가공
        const totalMemoryGB =
          parseInt(detailData.capacity.memory, 10) / 1024 / 1024; // KiB to GB

        const totalStorageGB =
          parseInt(detailData.capacity["ephemeral-storage"], 10) / 1024 / 1024; // KiB to GB

        // 조건 상태 처리
        const readyStatus = detailData.conditions.some((condition) =>
          condition.includes("Ready=True")
        )
          ? "Ready"
          : "Not Ready";

        // 새로운 데이터를 가공하여 업데이트
        return {
          ...prev,
          ...row,
          ...detailData,
          totalMemoryGB: totalMemoryGB.toFixed(2),
          totalStorageGB: totalStorageGB.toFixed(2),
          totalSwap: detailData.capacity.swap
            ? (parseInt(detailData.capacity.swap, 10) / 1024 / 1024).toFixed(
                2
              ) + " GB"
            : "0 GB",
          readyStatus,
        };
      });
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

  // 검색을 했다면 자동으로 1페이지로 바뀌게
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1); // 검색을 했다면 자동으로 1페이지로 바뀌게 설정
  };

  // 검색 필터링
  const filteredData = nodes
    ? nodes.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // 필터링 된 데이터에서 현재 페이지 인덱스 범위 계산
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredData.length);

  // 필터링 된 데이터 배열 잘라서 현재 페이지 데이터를 가져옴
  const currentPageData = filteredData.slice(startIndex, endIndex);

  // 테이블 페이지 버튼
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
            <h2>Node</h2>
            <p>Kubernetes Cluster Node</p>
          </div>
        </div>

        <div className="node-container">
          <div className="content-wrapper">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <CDBTable responsive>
              <CDBTableHeader>
                <tr className="table-header">
                  <th>NAME</th>
                  <th>IP</th>
                  <th>CPU</th>
                  <th>MEM</th>
                  <th>STATUS</th>
                  <th>OS</th>
                  <th>KUBELET VERSION</th>
                </tr>
              </CDBTableHeader>
              <CDBTableBody>
                {currentPageData.map((row, index) => (
                  <tr key={index} onClick={() => openDetailPopup(row)}>
                    <td>{row.name}</td>
                    <td>{row.ip}</td>
                    <td>{row.cpu_core}</td>
                    <td>{row.ram_capacity}</td>
                    <td>{row.status}</td>
                    <td>{row.os}</td>
                    <td>{row.kubelet_version}</td>
                  </tr>
                ))}
              </CDBTableBody>
            </CDBTable>

            <div className="pagination-container">
              {[...Array(Math.ceil(filteredData.length / pageSize)).keys()].map(
                (page) => (
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
                )
              )}
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
                      <Square15 topLeftText="CPU Core">
                        {selectedRow.cpu_core}
                      </Square15>
                      <Square15 topLeftText="Total Memory">
                        {selectedRow.totalMemoryGB} GB
                      </Square15>
                      <Square15 topLeftText="Total Root FS">
                        {selectedRow.totalStorageGB} GB
                      </Square15>
                      <Square15 topLeftText="Node Status">
                        {selectedRow.readyStatus}
                      </Square15>
                      <Square15 topLeftText="Pods Capacity">
                        {selectedRow.capacity.pods}
                      </Square15>
                      <Square15 topLeftText="Total Swap">
                        {selectedRow.totalSwap}
                      </Square15>
                      <Square4 topLeftText="Conditions">
                        {Array.isArray(selectedRow.conditions) ? (
                          <ul className="list">
                            {selectedRow.conditions.map((condition, index) => {
                              const [key, value] = condition.split("=");
                              return (
                                <li key={index}>
                                  <strong>{key}</strong>: {value}
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          "N/A"
                        )}
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

export default Node;
