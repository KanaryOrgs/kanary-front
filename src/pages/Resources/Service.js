import React, { useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "../Node/Node.css";
import "./Resources.css";
import { fetchData, confirm } from "../Utils";
import { useQuery } from "react-query";

export const Service = () => {
  const {
    data: services,
    isLoading: loadingServices,
    error: errorServices,
  } = useQuery("services", () =>
    fetchData("http://localhost:8080/v1/services")
  );
  confirm(loadingServices, errorServices);
  const pageSize = 8; // 최대 행 개수
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // 검색을 했다면 자동으로 1페이지로 바뀌게
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1); // 검색을 했다면 자동으로 1페이지로 바뀌게 설정
  };

  // 검색 필터링
  const filteredData = services
    ? services.filter((svc) =>
        svc.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h2>Service</h2>
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
                      <th>CLUSTER IP</th>
                      <th>PORT</th>
                      <th>LABLE</th>
                      <th>SELECTOR</th>
                    </tr>
                  </CDBTableHeader>
                  <CDBTableBody>
                    {currentPageData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.name}</td>
                        <td>{row.namespace}</td>
                        <td>{row.clusterIP}</td>
                        <td>
                          {Array.isArray(row.ports) ? (
                            row.ports.map((port, i) => (
                              <span key={i}>
                                {port.port}/{port.protocol}
                                {i < row.ports.length - 1 ? ", " : ""}
                              </span>
                            ))
                          ) : (
                            <span>{row.ports}</span>
                          )}
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

                        <td>
                          {row.selector
                            ? Object.entries(row.selector).map(
                                ([key, value], i) => (
                                  <span key={i}>
                                    {key}: {value}
                                    {i < Object.entries(row.selector).length - 1
                                      ? ", "
                                      : ""}
                                  </span>
                                )
                              )
                            : "<none>"}
                        </td>
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
          </div>
        </div>
      </div>
    </div>
  );
};
