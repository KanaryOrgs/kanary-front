import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "./Event.css";

import { fetchData, confirm } from "./Utils";
import { useQuery } from "react-query";

export const Event = () => {
  const {
    data: events,
    isLoading: loadingEvents,
    error: errorEvents,
  } = useQuery("events", () => fetchData("http://localhost:8080/v1/events"));
  confirm(loadingEvents, errorEvents);

  const pageSize = 10; // 최대 행 개수
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const pagesPerGroup = 10; // 한 번에 표시할 페이지 버튼 개수
  const openPopup = (row) => {
    setSelectedRow(row);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setSelectedRow(null);
    setIsPopupOpen(false);
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
                  <th>NAMESPACE</th>
                  <th>REASON</th>
                  <th>MESSAGE</th>
                  <th>LABELS</th>
                </tr>
              </CDBTableHeader>
              <CDBTableBody>
                {currentPageData.map((row, index) => (
                  <tr key={index} onClick={() => openPopup(row)}>
                    <td>{row.name}</td>
                    <td>{row.namespace}</td>
                    <td>{row.reason}</td>
                    <td>{row.message}</td>
                    <td>{row.labels}</td>
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
      </div>
    </div>
  );
};

export default Event;
