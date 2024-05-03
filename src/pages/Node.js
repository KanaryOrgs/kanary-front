import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "./Node.css";

export const Node = () => {
  // 샘플 데이터
  const sampleData = [
    {
      name: "Apdule",
      cpu: "4",
      mem: "8",
      disk: "14",
      status: "running",
      pod: "10",
      dateCreated: "2024.05.01",
    },
    {
      name: "hoxy",
      cpu: "4",
      mem: "8",
      disk: "14",
      status: "running",
      pod: "10",
      dateCreated: "2024.04.30",
    },
    {
      name: "top",
      cpu: "4",
      mem: "8",
      disk: "14",
      status: "running",
      pod: "10",
      dateCreated: "2023.11.20",
    },
    {
      name: "noire",
      cpu: "4",
      mem: "8",
      disk: "14",
      status: "running",
      pod: "10",
      dateCreated: "2024.05.01",
    },
    {
      name: "kaka",
      cpu: "4",
      mem: "8",
      disk: "14",
      status: "running",
      pod: "10",
      dateCreated: "2024.04.30",
    },
    {
      name: "halland",
      cpu: "4",
      mem: "8",
      disk: "14",
      status: "running",
      pod: "10",
      dateCreated: "2023.11.20",
    },
    {
      name: "vako",
      cpu: "4",
      mem: "8",
      disk: "14",
      status: "running",
      pod: "10",
      dateCreated: "2024.05.01",
    },
    {
      name: "martin",
      cpu: "4",
      mem: "8",
      disk: "14",
      status: "running",
      pod: "10",
      dateCreated: "2024.04.30",
    },
    {
      name: "ludwidson",
      cpu: "4",
      mem: "8",
      disk: "14",
      status: "running",
      pod: "10",
      dateCreated: "2023.11.20",
    },
    {
      name: "Bojanic",
      cpu: "4",
      mem: "8",
      disk: "14",
      status: "running",
      pod: "10",
      dateCreated: "2024.05.01",
    },
    {
      name: "Kelvin",
      cpu: "4",
      mem: "8",
      disk: "14",
      status: "running",
      pod: "10",
      dateCreated: "2024.04.30",
    },
    {
      name: "Matheus",
      cpu: "4",
      mem: "8",
      disk: "14",
      status: "running",
      pod: "10",
      dateCreated: "2023.11.20",
    },
    {
      name: "kanary",
      cpu: "Name",
      mem: "Name",
      disk: "Name",
      status: "Name",
      pod: "Name",
      dateCreated: "2024.05.01",
    },
    {
      name: "soc",
      cpu: "Name",
      mem: "Name",
      disk: "Name",
      status: "Name",
      pod: "Name",
      dateCreated: "2024.04.30",
    },
    {
      name: "mbhong",
      cpu: "Name",
      mem: "Name",
      disk: "Name",
      status: "Name",
      pod: "Name",
      dateCreated: "2023.11.20",
    },
    {
      name: "leo",
      cpu: "Name",
      mem: "Name",
      disk: "Name",
      status: "Name",
      pod: "Name",
      dateCreated: "2024.05.01",
    },
    {
      name: "uhd",
      cpu: "Name",
      mem: "Name",
      disk: "Name",
      status: "Name",
      pod: "Name",
      dateCreated: "2024.04.30",
    },
    {
      name: "son",
      cpu: "Name",
      mem: "Name",
      disk: "Name",
      status: "Name",
      pod: "Name",
      dateCreated: "2023.11.20",
    },
  ];

  const pageSize = 12; // 최대 행 개수
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

  // 검색 필터링
  const filteredData = sampleData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 필터링 된 데이터에서 현재 페이지 인덱스 범위 계산
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredData.length);

  // 필터링 된 데이터 배열 잘라서 현재 페이지 데이터를 가져옴(수정 해야할 듯)
  const currentPageData = filteredData.slice(startIndex, endIndex);

  // 테이블 페이지 버튼
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="d-flex">
      <div>
        <Sidebar />
      </div>
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          flexFlow: "column",
          height: "100vh",
          overflowY: "hidden",
        }}
      >
        <Navbar />
        <div style={{ height: "100%" }}>
          <div
            style={{
              padding: "20px 5%",
              height: "calc(100% - 64px)",
              overflowY: "scroll",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(1, minmax(200px, 100%))", // 화면에 맞게 max값 설정
              }}
            >
              <div className="mt-5">
                <div style={{ marginBottom: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        paddingRight: "10px", // 여유 공간위해 패딩 추가
                        paddingLeft: "10px",
                      }}
                    />
                  </div>
                </div>
                <CDBTable responsive>
                  <CDBTableHeader>
                    <tr style={{ verticalAlign: "middle" }}>
                      <th
                        style={{
                          backgroundColor: "#7C7C7C",
                          color: "#292929",
                          fontSize: "12px",
                        }}
                      >
                        NAME
                      </th>
                      <th
                        style={{
                          backgroundColor: "#7C7C7C",
                          color: "#292929",
                          fontSize: "12px",
                        }}
                      >
                        CPU
                      </th>
                      <th
                        style={{
                          backgroundColor: "#7C7C7C",
                          color: "#292929",
                          fontSize: "12px",
                        }}
                      >
                        MEM
                      </th>
                      <th
                        style={{
                          backgroundColor: "#7C7C7C",
                          color: "#292929",
                          fontSize: "12px",
                        }}
                      >
                        DISK
                      </th>
                      <th
                        style={{
                          backgroundColor: "#7C7C7C",
                          color: "#292929",
                          fontSize: "12px",
                        }}
                      >
                        STATUS
                      </th>
                      <th
                        style={{
                          backgroundColor: "#7C7C7C",
                          color: "#292929",
                          fontSize: "12px",
                        }}
                      >
                        POD
                      </th>
                      <th
                        style={{
                          backgroundColor: "#7C7C7C",
                          color: "#292929",
                          fontSize: "12px",
                        }}
                      >
                        DATE CREATED
                      </th>
                    </tr>
                  </CDBTableHeader>
                  <CDBTableBody>
                    {currentPageData.map((row, index) => (
                      <tr key={index} onClick={() => openPopup(row)}>
                        <td>{row.name}</td>
                        <td>{row.cpu}</td>
                        <td>{row.mem}</td>
                        <td>{row.disk}</td>
                        <td>{row.status}</td>
                        <td>{row.pod}</td>
                        <td>{row.dateCreated}</td>
                      </tr>
                    ))}
                  </CDBTableBody>
                </CDBTable>

                {/* 페이지 버튼 */}
                <div className="d-flex justify-content-center">
                  {[
                    ...Array(Math.ceil(filteredData.length / pageSize)).keys(),
                  ].map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page + 1)}
                      disabled={currentPage === page + 1}
                      style={{
                        width: "30px",
                        height: "30px",
                        fontSize: "14px",
                        border: "none", // 테두리 없애기
                        borderRadius: "18%",
                        backgroundColor:
                          currentPage === page + 1 ? "#004098" : "#1F2838", // 페이지 누를 때 마다 색 다르게
                        color: "white", // 폰트 색깔
                        margin: "0 5px", // 버튼 간격
                      }}
                    >
                      {page + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {isPopupOpen && (
              <div className="popup">
                {/* 팝업 */}
                <div>Name: {selectedRow.name}</div>
                <div>CPU: {selectedRow.cpu}</div>
                <div>MEM: {selectedRow.mem}</div>
                <div>DISK: {selectedRow.disk}</div>
                <div>Status: {selectedRow.status}</div>
                <div>Pod: {selectedRow.pod}</div>
                <div>Date Created: {selectedRow.dateCreated}</div>
                <button onClick={closePopup}>Close</button>
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

export default Node;
