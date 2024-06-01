import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import { Line } from 'react-chartjs-2';
import { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto';
import "./Node.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
// Sample data for the charts
const cpuData = {
  labels: ['00:00', '03:30', '07:00', '10:30', '14:00', '17:30', '21:00'],
  datasets: [
    {
      label: '% CPU Usage',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
    },
  ],
};

const ramData = {
  labels: ['00:00', '03:30', '07:00', '10:30', '14:00', '17:30', '21:00'],
  datasets: [
    {
      label: '% RAM Usage',
      data: [45, 39, 60, 71, 46, 35, 30],
      fill: false,
      backgroundColor: 'rgba(153,102,255,0.4)',
      borderColor: 'rgba(153,102,255,1)',
    },
  ],
};


const chartOptions = {
  maintainAspectRatio: false,
  scales: {
    x: {
      beginAtZero: true,
    },
    y: {
      beginAtZero: true,
    },
  },
};

export const Node = () => {
  // 샘플 데이터
  const sampleData = [
    {
      "name": "master",
      "status": "Ready",
      "ip": "10.10.0.118",
      "cpu_core": 8,
      "ram_capacity": 15,
      "os": "Ubuntu 22.04.3 LTS",
      "kubelet_version": "v1.29.4",
      "conditions": [
        "NetworkUnavailable=False",
        "MemoryPressure=False",
        "DiskPressure=False",
        "PIDPressure=False",
        "Ready=True"
      ],
      "labels": {
        "beta.kubernetes.io/arch": "amd64",
        "beta.kubernetes.io/os": "linux",
        "kubernetes.io/arch": "amd64",
        "kubernetes.io/hostname": "master",
        "kubernetes.io/os": "linux",
        "node-role.kubernetes.io/control-plane": "",
        "node.kubernetes.io/exclude-from-external-load-balancers": ""
      },
      "allocatable": {
        "cpu": "8",
        "ephemeral-storage": "35975901944",
        "hugepages-1Gi": "0",
        "hugepages-2Mi": "0",
        "memory": "16269788Ki",
        "pods": "110"
      },
      "capacity": {
        "cpu": "8",
        "ephemeral-storage": "39036352Ki",
        "hugepages-1Gi": "0",
        "hugepages-2Mi": "0",
        "memory": "16372188Ki",
        "pods": "110"
      }
    },
    {
      "name": "worker",
      "status": "Ready",
      "ip": "10.10.0.119",
      "cpu_core": 8,
      "ram_capacity": 10,
      "os": "Ubuntu 22.04.3 LTS",
      "kubelet_version": "v1.29.4",
      "conditions": [
        "NetworkUnavailable=False",
        "MemoryPressure=False",
        "DiskPressure=False",
        "PIDPressure=False",
        "Ready=True"
      ],
      "labels": {
        "beta.kubernetes.io/arch": "amd64",
        "beta.kubernetes.io/os": "linux",
        "kubernetes.io/arch": "amd64",
        "kubernetes.io/hostname": "worker",
        "kubernetes.io/os": "linux",
        "node-role.kubernetes.io/control-plane": "",
        "node.kubernetes.io/exclude-from-external-load-balancers": ""
      },
      "allocatable": {
        "cpu": "8",
        "ephemeral-storage": "35975901944",
        "hugepages-1Gi": "0",
        "hugepages-2Mi": "0",
        "memory": "16269788Ki",
        "pods": "110"
      },
      "capacity": {
        "cpu": "8",
        "ephemeral-storage": "39036352Ki",
        "hugepages-1Gi": "0",
        "hugepages-2Mi": "0",
        "memory": "16372188Ki",
        "pods": "110"
      }
    },
  ];

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
  const filteredData = sampleData.filter((item) =>
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
        <div><Sidebar/></div>
        <div style={{flex: "1 1 auto", display: "flex", flexFlow: "column", height: "100vh", overflowY: "hidden"}}>
          <Navbar/>
        <div className="event-content">
          <div className="event-header">
            <div>
              <h2>Node</h2>
              <p>Kubernetes Cluster Node</p>
            </div>
          </div>
        </div>
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
                      onChange={(e) => handleSearch(e.target.value)}
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
                        IP
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
                        STATUS
                      </th>
                      <th
                        style={{
                          backgroundColor: "#7C7C7C",
                          color: "#292929",
                          fontSize: "12px",
                        }}
                      >
                        OS
                      </th>
                      <th
                        style={{
                          backgroundColor: "#7C7C7C",
                          color: "#292929",
                          fontSize: "12px",
                        }}
                      >
                        KUBELET VERSION
                      </th>
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
                        borderRadius: "4px",
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
                <h2>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="close-button"
                    onClick={closePopup}
                  />{" "}
                  {selectedRow.name}
                </h2>
                <div
                  style={{ overflowY: "auto", maxHeight: "calc(100vh - 15%)" }}
                >
                  {" "}
                  {/*-값 조절해서 팝업 아래 가리는 값 조절*/}
                  {/* 팝업 */}
                  <Square1 topLeftText="CPU Busy" progress={3.45}>
                    {3.45}%
                  </Square1>
                  <Square1 topLeftText="Sys Load(5m)" progress={3.0}>
                    {3.0}%
                  </Square1>
                  <Square1 topLeftText="Sys Load(15m)" progress={3.75}>
                    {3.75}%
                  </Square1>
                  <Square1 topLeftText="Ram Used" progress={28.32}>
                    {28.32}%
                  </Square1>
                  <Square1 topLeftText="Swap Used" progress={0}>
                    {0}%
                  </Square1>
                  <Square1 topLeftText="Root FS Used" progress={78.63}>
                    {78.63}%
                  </Square1>
                  <Square2 topLeftText="CPU Core">{selectedRow.cpu_core}</Square2>
                  <Square2 topLeftText="Uptime">
                    {15}d {4}h
                  </Square2>
                  <Square2 topLeftText="Last Data">{2} sec ago</Square2>
                  <Square2 topLeftText="Total Root FS">{14}GB</Square2>
                  <Square2 topLeftText="Ram Total">{selectedRow.ram_capacity}GB</Square2>
                  <Square2 topLeftText="Total Swap">{0}B</Square2>
                  <Square3 topLeftText="% CPU Usage (Avg)">
                    <div style={{ height: '200px' }}>
                      <Line data={cpuData} options={chartOptions} />
                    </div>
                  </Square3>
                  <Square3 topLeftText="% Memory Usage (Avg)">
                    <div style={{ height: '200px' }}>
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

class Square1 extends React.Component {
  render() {
    const style = {
      width: "215px",
      height: "120px",
      backgroundColor: "#3D4657",
      display: "inline-block",
      position: "relative", // 상대적 위치 설정
      borderRadius: "4px",
      margin: "15px 15px 0 0", // 위쪽 15px, 오른쪽 15px 여백 추가
    };

    const topLeftTextStyle = {
      position: "absolute", // 절대적 위치 설정
      top: "10px", // 위쪽 여백
      left: "10px", // 왼쪽 여백
      color: this.props.topLeftColor || "#FFFFFF", // 텍스트 색상
      fontSize: this.props.topLeftFontSize || "13px", // 글꼴 크기
    };

    const centerTextStyle = {
      position: "absolute", // 절대적 위치 설정
      top: "50%", // 세로 중앙 정렬
      left: "50%", // 가로 중앙 정렬
      transform: "translate(-50%, -50%)", // 가운데 정렬
      color: this.props.centerColor || "#45828E", // 텍스트 색상
      fontSize: this.props.centerFontSize || "18px", // 글꼴 크기
      fontWeight: this.props.topLeftFontWeight || "bold", // 글꼴 굵기
    };

    const progressBarStyle = {
      position: "absolute", // 절대적 위치 설정
      bottom: "15px", // 아래쪽 여백
      left: "10px", // 왼쪽 여백
      right: "10px", // 오른쪽 여백
      width: "195px", // 프로그레스 바 너비
      height: "15px", // 프로그레스 바 높이
      borderRadius: "4px 4px 0 0", // 프로그레스 바 모서리 반경
      direction: "rtl", // 오른쪽부터 채우도록 설정
      backgroundImage:
        "linear-gradient(to right, #00C5A0 0%, #00C5A0 50%, #FF0016 100%)", // 75%에서 그라데이션 변화하도록 설정
    };

    const progressBarStyle2 = {
      position: "absolute", // 절대적 위치 설정
      bottom: "10px", // 아래쪽 여백
      left: "10px", // 왼쪽 여백
      right: "10px", // 오른쪽 여백
      width: "195px", // 프로그레스 바 너비
      height: "5px", // 프로그레스 바 높이
      borderRadius: "0 0 4px 4px", // 프로그레스 바 모서리 반경
      border: "1px solid #D8DADD", // 테두리 추가
      backgroundImage:
        "linear-gradient(to right, #00C5A0 0%, #00C5A0 50%, #FF0016 100%)", // 75%에서 그라데이션 변화하도록 설정
    };

    const progressBarBorder = {
      position: "absolute", // 절대적 위치 설정
      bottom: "15px", // 아래쪽 여백
      left: "10px", // 왼쪽 여백
      right: "10px", // 오른쪽 여백
      width: "195px", // 프로그레스 바 너비
      height: "15px", // 프로그레스 바 높이
      borderRadius: "4px 4px 0 0", // 프로그레스 바 모서리 반경
      border: "1px solid #D8DADD", // 테두리 추가
    };

    const progressFillStyle = {
      height: "100%", // 프로그레스 바 채우는 영역 높이
      width: `${100 - this.props.progress}%`, // 100에서 넣은 값 뺀 값으로 설정
      backgroundColor: "#3D4657", // 프로그레스 바 채우는 영역 색상
    };

    return (
      <div style={style}>
        {/* 왼쪽 위에 텍스트 */}
        <div style={topLeftTextStyle}>{this.props.topLeftText}</div>
        {/* 가운데에 텍스트 */}
        <div style={centerTextStyle}>{this.props.children}</div>
        {/* 프로그레스 바 */}
        <div style={progressBarStyle}>
          <div style={progressFillStyle}></div>
        </div>
        <div style={progressBarBorder}></div>
        <div style={progressBarStyle2}></div>
      </div>
    );
  }
}

class Square2 extends React.Component {
  render() {
    const style = {
      width: "100px",
      height: "100px",
      backgroundColor: "#3D4657",
      display: "inline-block",
      position: "relative", // 상대적 위치 설정
      borderRadius: "4px",
      margin: "15px 15px 0 0", // 위쪽 15px, 오른쪽 15px 여백 추가
    };

    const topLeftTextStyle = {
      position: "absolute", // 절대적 위치 설정
      top: "10px", // 위쪽 여백
      left: "10px", // 왼쪽 여백
      color: this.props.topLeftColor || "#FFFFFF", // 텍스트 색상
      fontSize: this.props.topLeftFontSize || "13px", // 글꼴 크기
    };

    const centerTextStyle = {
      position: "absolute", // 절대적 위치 설정
      top: "50%", // 세로 중앙 정렬
      left: "50%", // 가로 중앙 정렬
      transform: "translate(-50%, -50%)", // 가운데 정렬
      color: this.props.centerColor || "#45828E", // 텍스트 색상
      fontSize: this.props.centerFontSize || "18px", // 글꼴 크기
      fontWeight: this.props.topLeftFontWeight || "bold", // 글꼴 굵기
    };

    return (
      <div style={style}>
        {/* 왼쪽 위에 텍스트 */}
        <div style={topLeftTextStyle}>{this.props.topLeftText}</div>
        {/* 가운데에 텍스트 */}
        <div style={centerTextStyle}>{this.props.children}</div>
      </div>
    );
  }
}

class Square3 extends React.Component {
  render() {
    
    const style = {
      width: "675px",
      height: "200px",
      backgroundColor: "#3D4657",
      display: "inline-block",
      position: "relative", // 상대적 위치 설정
      borderRadius: "4px",
      margin: "15px 15px 0 0", // 위쪽 15px, 오른쪽 15px 여백 추가
    };

    const topLeftTextStyle = {
      position: "absolute", // 절대적 위치 설정
      top: "10px", // 위쪽 여백
      left: "10px", // 왼쪽 여백
      color: this.props.topLeftColor || "#FFFFFF", // 텍스트 색상
      fontSize: this.props.topLeftFontSize || "13px", // 글꼴 크기
    };

    const centerTextStyle = {
      position: "absolute", // 절대적 위치 설정
      top: "50%", // 세로 중앙 정렬
      left: "50%", // 가로 중앙 정렬
      transform: "translate(-50%, -50%)", // 가운데 정렬
      color: this.props.centerColor || "#45828E", // 텍스트 색상
      fontSize: this.props.centerFontSize || "18px", // 글꼴 크기
      fontWeight: this.props.topLeftFontWeight || "bold", // 글꼴 굵기
    };

    return (
      <div style={style}>
        {/* 왼쪽 위에 텍스트 */}
        <div style={topLeftTextStyle}>{this.props.topLeftText}</div>
        {/* 가운데에 텍스트 */}
        <div style={centerTextStyle}>{this.props.children}</div>
      </div>
    );
  }
}
