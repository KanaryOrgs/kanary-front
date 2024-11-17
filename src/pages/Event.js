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

  const pageSize = 8; // 최대 행 개수
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Node;
