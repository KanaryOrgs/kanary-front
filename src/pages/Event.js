import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "./Event.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Square15, Square4 } from "./Node/Squares";
import { fetchData, confirm } from "./Utils";
import { useQuery } from "react-query";

export const Event = () => {
  const pageSize = 8; // 최대 행 개수
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const pagesPerGroup = 10; // 한 번에 표시할 페이지 버튼 개수

  const {
    data: events,
    isLoading: loadingEvents,
    error: errorEvents,
  } = useQuery("events", () => fetchData("http://localhost:8080/v1/events"));
  confirm(loadingEvents, errorEvents);
  if (loadingEvents) return <p>Loading Events...</p>;
  if (errorEvents) return <p>Error loading Events.</p>;

  // 상태 업데이트: 로딩 중에도 이전 데이터를 유지
  const openDetailPopup = async (row) => {
    setIsDetailPopupOpen(true); // 팝업 열기
    setLoadingDetail(true); // 로딩 시작

    try {
      const detailUrl = `http://localhost:8080/v1/events/${row.namespace}/${row.name}`;
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
  // 검색을 했다면 자동으로 1페이지로 바뀌게
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1); // 검색을 했다면 자동으로 1페이지로 바뀌게 설정
  };

  // 검색 필터링
  const filteredData = events
    ? events.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // 필터링 된 데이터에서 현재 페이지 인덱스 범위 계산
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredData.length);

  // 필터링 된 데이터 배열 잘라서 현재 페이지 데이터를 가져옴
  const currentPageData = filteredData.slice(startIndex, endIndex);
  // 전체 페이지 수
  const totalPages = Math.ceil(filteredData.length / pageSize);

  // 현재 페이지 그룹 계산
  const currentGroup = Math.floor((currentPage - 1) / pagesPerGroup);

  // 현재 그룹에 표시할 페이지 버튼 계산
  const startPage = currentGroup * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

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
            <h2>Events</h2>
            <p>Kubernetes Cluster Node</p>
          </div>
        </div>

        <div className="node-container">
          <div className="content-wrapper">
            <div className="grid-wrapper">
              <div className="mt-5">
                <div className="search-filter-wrapper">
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
                      <th>NAMESPACE</th>
                      <th>REASON</th>
                      <th>MESSAGE</th>
                      <th>LABELS</th>
                    </tr>
                  </CDBTableHeader>
                  <CDBTableBody>
                    {currentPageData.map((row, index) => (
                      <tr key={index} onClick={() => openDetailPopup(row)}>
                        <td>{row.name}</td>
                        <td>{row.namespace}</td>
                        <td>{row.reason}</td>
                        <td className="table-cell-ellipsis">{row.message}</td>
                        <td>
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
                  {/* 이전 그룹으로 이동 */}
                  {currentGroup > 0 && (
                    <button
                      onClick={() => goToPage(startPage - pagesPerGroup)}
                      className="pagination-button"
                    >
                      &laquo;
                    </button>
                  )}

                  {/* 현재 그룹의 페이지 버튼 */}
                  {[...Array(endPage - startPage + 1).keys()].map((i) => {
                    const page = startPage + i;
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        disabled={currentPage === page}
                        className={`pagination-button ${
                          currentPage === page ? "active" : ""
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* 다음 그룹으로 이동 */}
                  {endPage < totalPages && (
                    <button
                      onClick={() => goToPage(endPage + 1)}
                      className="pagination-button"
                    >
                      &raquo;
                    </button>
                  )}
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
                      <Square15 topLeftText="Reason">
                        {selectedRow.reason || "<none>"}
                      </Square15>
                      <Square15 topLeftText="Source">
                        {selectedRow.source || "<none>"}
                      </Square15>

                      <Square4 topLeftText="Creation Time">
                        {selectedRow.creation_time
                          ? new Date(selectedRow.creation_time).toUTCString()
                          : "N/A"}
                      </Square4>
                      <Square4 topLeftText="Labels">
                        {selectedRow.labels ? (
                          <ul className="labels-list">
                            {Object.entries(selectedRow.labels).map(
                              ([key, value], index) => (
                                <li key={index}>
                                  <strong>{key}</strong>: {value || "N/A"}
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          "<none>"
                        )}
                      </Square4>
                      <Square4 topLeftText="Messages">
                        {selectedRow.message}
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

export default Event;
