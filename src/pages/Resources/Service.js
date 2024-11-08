import React, { useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "../Node/Node.css";
import "./Resources.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Square1, Square1_5, Square2, Square3 } from "../Node/Squares";

// 샘플 데이터
const sampleData = [
    {
      name: "nginx",
      namespace: "default",
      clusterIp: "10.151.221.32", // ip
      ports: "80", // 가정된 값
      labels: "run=nginx",
      selector: "app=nginx", // 가정된 값
    },
    {
      name: "nginx2",
      namespace: "nginx",
      clusterIp: "10.24.11.231", // ip
      ports: "80", // 가정된 값
      labels: "run=nginx",
      selector: "app=nginx", // 가정된 값
    },
    {
      name: "nginx3",
      namespace: "nginx",
      clusterIp: "10.24.11.181", // ip
      ports: "80", // 가정된 값
      labels: "run=nginx",
      selector: "app=nginx", // 가정된 값
    },
    {
      name: "nginx-default",
      namespace: "default",
      clusterIp: "10.212.464.69", // ip
      ports: "80", // 가정된 값
      labels: "run=nginx",
      selector: "app=nginx", // 가정된 값
    },
    {
      name: "httpbin",
      namespace: "default",
      clusterIp: "10.112.473.22", // ip
      ports: "80", // 가정된 값
      labels: "run=pod",
      selector: "app=httpbin", // 가정된 값
    },
    {
      name: "calico-kube-controllers-7c968b5878-frgdz",
      namespace: "kube-system",
      clusterIp: "10.244.171.66", // ip
      ports: "443", // 가정된 값
      labels: "k8s-app=calico-kube-controllers",
      selector: "app=calico", // 가정된 값
    },
    {
      name: "calico-node-cccq9",
      namespace: "kube-system",
      clusterIp: "10.244.171.61", // ip
      ports: "443", // 가정된 값
      labels: "k8s-app=calico-node",
      selector: "app=calico", // 가정된 값
    },
    {
      name: "calico-node-xnwt5",
      namespace: "kube-system",
      clusterIp: "10.244.171.53", // ip
      ports: "443", // 가정된 값
      labels: "k8s-app=calico-node",
      selector: "app=calico", // 가정된 값
    },
    {
      name: "coredns-76f75df574-tpdg5",
      namespace: "kube-system",
      clusterIp: "10.244.171.67", // ip
      ports: "53", // 가정된 값
      labels: "k8s-app=kube-dns",
      selector: "app=coredns", // 가정된 값
    },
    {
      name: "coredns-76f75df574-x72z8",
      namespace: "kube-system",
      clusterIp: "10.244.171.65", // ip
      ports: "53", // 가정된 값
      labels: "k8s-app=kube-dns",
      selector: "app=coredns", // 가정된 값
    },
    {
      name: "etcd-master",
      namespace: "kube-system",
      clusterIp: "10.244.171.45", // ip
      ports: "2379", // 가정된 값
      labels: "component=etcd",
      selector: "app=etcd", // 가정된 값
    },
    {
      name: "kube-apiserver-master",
      namespace: "kube-system",
      clusterIp: "10.244.171.31", // ip
      ports: "6443", // 가정된 값
      labels: "component=kube-apiserver",
      selector: "app=kube-apiserver", // 가정된 값
    },
    {
      name: "kube-controller-manager-master",
      namespace: "kube-system",
      clusterIp: "10.244.171.39", // ip
      ports: "10257", // 가정된 값
      labels: "component=kube-controller-manager",
      selector: "app=kube-controller-manager", // 가정된 값
    },
    {
      name: "kube-proxy-ml8kc",
      namespace: "kube-system",
      clusterIp: "10.244.171.36", // ip
      ports: "10256", // 가정된 값
      labels: "k8s-app=kube-proxy",
      selector: "app=kube-proxy", // 가정된 값
    },
    {
      name: "kube-proxy-nrtqv",
      namespace: "kube-system",
      clusterIp: "10.244.171.25", // ip
      ports: "10256", // 가정된 값
      labels: "k8s-app=kube-proxy",
      selector: "app=kube-proxy", // 가정된 값
    },
    {
      name: "kube-scheduler-master",
      namespace: "kube-system",
      clusterIp: "10.244.171.22", // ip
      ports: "10259", // 가정된 값
      labels: "component=kube-scheduler",
      selector: "app=kube-scheduler", // 가정된 값
    },
  ];
  

const statusColors = {
  Stop: "badge-stop",
  Running: "badge-running",
  Pending: "badge-pending",
};

export const Service = () => {
  const pageSize = 8; // 최대 행 개수
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 필터 팝업 상태
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false); // 디테일 팝업 상태


  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [checkboxes, setCheckboxes] = useState([
    { id: 1, label: "nginx", isChecked: false },
    { id: 2, label: "kube", isChecked: false },
    { id: 3, label: "etcd", isChecked: false },
    // Add more checkboxes as needed
  ]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const openDetailPopup = (row) => {
    setSelectedRow(row);
    setIsDetailPopupOpen(true);
  }

  const closeDetailPopup = () => {
    setIsDetailPopupOpen(false);
  };

  const handleSelectAllChange = () => {
    const newSelectAllChecked = !isSelectAllChecked;
    setIsSelectAllChecked(newSelectAllChecked);
    setCheckboxes(
      checkboxes.map((checkbox) => ({
        ...checkbox,
        isChecked: newSelectAllChecked,
      }))
    );
  };

  const handleCheckboxChange = (id) => {
    const updatedCheckboxes = checkboxes.map((checkbox) =>
      checkbox.id === id
        ? { ...checkbox, isChecked: !checkbox.isChecked }
        : checkbox
    );
    setCheckboxes(updatedCheckboxes);

    const allChecked = updatedCheckboxes.every(
      (checkbox) => checkbox.isChecked
    );
    const noneChecked = updatedCheckboxes.every(
      (checkbox) => !checkbox.isChecked
    );
    if (allChecked || noneChecked) {
      setIsSelectAllChecked(allChecked);
    }
  };

  // 검색을 했다면 자동으로 1페이지로 바뀌게
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1); // 검색을 했다면 자동으로 1페이지로 바뀌게 설정
  };

  const handleRemoveFilter = (label) => {
    const updatedCheckboxes = checkboxes.map((checkbox) =>
      checkbox.label === label ? { ...checkbox, isChecked: false } : checkbox
    );
    setCheckboxes(updatedCheckboxes);
    setIsSelectAllChecked(false);
  };

  const getActiveFilters = () => {
    return checkboxes
      .filter((checkbox) => checkbox.isChecked)
      .map((checkbox) => checkbox.label);
  };

  const filteredData = sampleData.filter((item) => {
    const matchesSearchTerm = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const activeFilters = getActiveFilters();
    const matchesFilters =
      activeFilters.length === 0 ||
      activeFilters.every((filter) => item.name.includes(filter));
    return matchesSearchTerm && matchesFilters;
  });

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
            <h2>Resources-Service</h2>
            <p>Kubernetes Cluster Resources</p>
          </div>
        </div>

        <div className="node-container">
          <div className="content-wrapper">
            <div className="grid-wrapper">
              <div className="mt-5">
                <div className="search-filter-wrapper">
                  <div className="filter-container">
                    {getActiveFilters().map(
                      (
                        filter // 필터 상자
                      ) => (
                        <div key={filter} className="filter-box">
                          <span>{filter}</span>
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="close-icon"
                            onClick={() => handleRemoveFilter(filter)}
                          />
                        </div>
                      )
                    )}
                  </div>
                  <input // 검색창
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="search-input-resources"
                  />

                  <button // 필터 버튼
                    onClick={openPopup}
                    className="button"
                  >
                    Filter
                  </button>
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
                      <tr key={index} onClick={() => openDetailPopup(row)}>
                        <td>{row.name}</td>
                        <td>{row.namespace}</td>
                        <td>{row.clusterIp}</td>
                        <td>{row.ports}%</td>
                        <td>{row.labels}%</td>
                        <td>{row.selector}%</td>
                        <td>
                          <span className={`badge ${statusColors[row.status]}`}>
                            {row.status}
                          </span>
                        </td>
                        <td>{row.start_time}</td>
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
            {isPopupOpen && (
              <div className="popup">
                <h2>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="close-button"
                    onClick={closePopup}
                  />{" "}
                  Select Filters
                </h2>
                <div className="filter-popup">
                  <div>
                    <input
                      type="checkbox"
                      checked={isSelectAllChecked}
                      onChange={handleSelectAllChange}
                    />
                    <label>Select All</label>
                  </div>
                  <div className="checkbox-container">
                    {checkboxes.map((checkbox) => (
                      <div key={checkbox.id}>
                        <input
                          type="checkbox"
                          checked={checkbox.isChecked}
                          onChange={() => handleCheckboxChange(checkbox.id)}
                        />
                        <label>{checkbox.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {isDetailPopupOpen && (
              <div className="popup">
                <h2>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="close-button"
                    onClick={closeDetailPopup}
                  />
                  {selectedRow.name}
                </h2>
                <div className="popup-content">
                  <Square1_5 topLeftText="Protocol">
                    {selectedRow.protocol}
                  </Square1_5>
                  <Square1_5 topLeftText="Port">
                    {selectedRow.ports}
                  </Square1_5>
                </div>
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