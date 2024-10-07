import React, { useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import { Line } from "react-chartjs-2";
import "./Node.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { chartOptions } from "../Chart";
import { fetchData, confirm } from "../Utils";
import { useQuery } from "react-query";
import { Square1, Square2, Square3 } from "./Squares";

// Sample data for the charts
const cpuData = {
  labels: ["00:00", "03:30", "07:00", "10:30", "14:00", "17:30", "21:00"],
  datasets: [
    {
      label: "% CPU Usage",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
    },
  ],
};

const ramData = {
  labels: ["00:00", "03:30", "07:00", "10:30", "14:00", "17:30", "21:00"],
  datasets: [
    {
      label: "% RAM Usage",
      data: [45, 39, 60, 71, 46, 35, 30],
      fill: false,
      backgroundColor: "rgba(153,102,255,0.4)",
      borderColor: "rgba(153,102,255,1)",
    },
  ],
};

export const Node = () => {
  const {
    data: nodes,
    isLoading: loadingNodes,
    error: errorNodes,
  } = useQuery("nodes", () => fetchData("http://localhost:8080/v1/nodes"));
  confirm(loadingNodes, errorNodes);

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
  const filteredData = nodes.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <tr key={index} onClick={() => openPopup(row)}>
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

            {isPopupOpen && (
              <div className="popup">
                <h2>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="close-button"
                    onClick={closePopup}
                  />
                  {selectedRow.name}
                </h2>
                <div className="popup-content">
                  <Square1 topLeftText="CPU Busy" progress={3.45}>
                    {3.45}%
                  </Square1>
                  <Square1 topLeftText="Sys Load(5m)" progress={3.0}>
                    {3.0}%
                  </Square1>
                  <Square1 topLeftText="Sys Load(15m)" progress={3.45}>
                    {3.45}%
                  </Square1>
                  <Square1 topLeftText="Ram Used" progress={3.0}>
                    {3.0}%
                  </Square1>
                  <Square1 topLeftText="Swap Used" progress={3.45}>
                    {3.45}%
                  </Square1>
                  <Square1 topLeftText="Root FS Used" progress={3.0}>
                    {3.0}%
                  </Square1>
                  <Square2 topLeftText="CPU Core">
                    {selectedRow.cpu_core}
                  </Square2>
                  <Square2 topLeftText="Uptime">
                    {15}d {4}h
                  </Square2>
                  <Square2 topLeftText="Last Data">{2} sec ago</Square2>
                  <Square2 topLeftText="Total Root FS">{14}GB</Square2>
                  <Square2 topLeftText="Ram Total">
                    {selectedRow.ram_capacity}GB
                  </Square2>
                  <Square2 topLeftText="Total Swap">{0}B</Square2>
                  <Square3 topLeftText="% CPU Usage (Avg)">
                    <div style={{ height: "200px" }}>
                      <Line data={cpuData} options={chartOptions} />
                    </div>
                  </Square3>
                  <Square3 topLeftText="% Memory Usage (Avg)">
                    <div style={{ height: "200px" }}>
                      <Line data={ramData} options={chartOptions} />
                    </div>
                  </Square3>
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
