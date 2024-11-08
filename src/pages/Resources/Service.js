import React, { useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "../Node/Node.css";
import "./Resources.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { fetchData, confirm } from "../Utils";
import { useQuery } from "react-query";

// 샘플 데이터
const sampleData = [
  {
    name: "kubernetes",
    namespace: "default",
    clusterIP: "10.96.0.1",
    ports: [
      {
        name: "https",
        protocol: "TCP",
        port: 443,
      },
    ],
    labels: {
      component: "apiserver",
      provider: "kubernetes",
    },
    selector: null,
  },
  {
    name: "testweb",
    namespace: "default",
    clusterIP: "10.109.175.38",
    ports: [
      {
        name: "",
        protocol: "TCP",
        port: 8080,
      },
    ],
    labels: {
      app: "testweb",
    },
    selector: {
      app: "testweb",
    },
  },
  {
    name: "testweb2",
    namespace: "default",
    clusterIP: "10.104.157.158",
    ports: [
      {
        name: "",
        protocol: "TCP",
        port: 8081,
      },
    ],
    labels: {
      app: "testweb2",
    },
    selector: {
      app: "testweb2",
    },
  },
  {
    name: "kube-dns",
    namespace: "kube-system",
    clusterIP: "10.96.0.10",
    ports: [
      {
        name: "dns",
        protocol: "UDP",
        port: 53,
      },
      {
        name: "dns-tcp",
        protocol: "TCP",
        port: 53,
      },
      {
        name: "metrics",
        protocol: "TCP",
        port: 9153,
      },
    ],
    labels: {
      "k8s-app": "kube-dns",
      "kubernetes.io/cluster-service": "true",
      "kubernetes.io/name": "CoreDNS",
    },
    selector: {
      "k8s-app": "kube-dns",
    },
  },
];

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
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 필터 팝업 상태

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

  const filteredData = services
    ? services.filter((item) => {
        const matchesSearchTerm = item.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const activeFilters = getActiveFilters();
        const matchesFilters =
          activeFilters.length === 0 ||
          activeFilters.every((filter) => item.name.includes(filter));
        return matchesSearchTerm && matchesFilters;
      })
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
          </div>
        </div>
      </div>
    </div>
  );
};
