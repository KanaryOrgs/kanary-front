import React, { useEffect, useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "../Node/Node.css";
import "./Resources.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const sampleData = [
  {
    name: "ingress-1",
    namespace: "default",
    host: "example1.com",
    paths: ["/path1", "/path2"],
    labels: { app: "nginx", tier: "frontend" },
  },
  {
    name: "ingress-2",
    namespace: "kube-system",
    host: "example2.com",
    paths: ["/path3", "/path4"],
    labels: { app: "nginx", tier: "backend" },
  },
  {
    name: "ingress-3",
    namespace: "default",
    host: "example3.com",
    paths: ["/path5"],
    labels: { app: "flask", tier: "frontend" },
  },
  {
    name: "ingress-4",
    namespace: "default",
    host: "example4.com",
    paths: ["/path6"],
    labels: { app: "nginx", tier: "api" },
  },
  {
    name: "ingress-5",
    namespace: "kube-system",
    host: "example5.com",
    paths: ["/path7", "/path8"],
    labels: { app: "nodejs", tier: "api" },
  },
  {
    name: "ingress-6",
    namespace: "default",
    host: "example6.com",
    paths: ["/path9"],
    labels: { app: "flask", tier: "backend" },
  },
  {
    name: "ingress-7",
    namespace: "default",
    host: "example7.com",
    paths: ["/path10"],
    labels: { app: "nginx", tier: "frontend" },
  },
  {
    name: "ingress-8",
    namespace: "kube-system",
    host: "example8.com",
    paths: ["/path11"],
    labels: { app: "nginx", tier: "api" },
  },
  {
    name: "ingress-9",
    namespace: "default",
    host: "example9.com",
    paths: ["/path12"],
    labels: { app: "django", tier: "frontend" },
  },
  {
    name: "ingress-10",
    namespace: "default",
    host: "example10.com",
    paths: ["/path13", "/path14"],
    labels: { app: "react", tier: "frontend" },
  },
  {
    name: "ingress-11",
    namespace: "kube-system",
    host: "example11.com",
    paths: ["/path15"],
    labels: { app: "express", tier: "backend" },
  },
  {
    name: "ingress-12",
    namespace: "default",
    host: "example12.com",
    paths: ["/path16"],
    labels: { app: "vue", tier: "frontend" },
  },
  {
    name: "ingress-13",
    namespace: "default",
    host: "example13.com",
    paths: ["/path17"],
    labels: { app: "nginx", tier: "api" },
  },
  {
    name: "ingress-14",
    namespace: "kube-system",
    host: "example14.com",
    paths: ["/path18"],
    labels: { app: "nextjs", tier: "frontend" },
  },
  {
    name: "ingress-15",
    namespace: "default",
    host: "example15.com",
    paths: ["/path19", "/path20"],
    labels: { app: "spring", tier: "backend" },
  },
  {
    name: "ingress-16",
    namespace: "default",
    host: "example16.com",
    paths: ["/path21"],
    labels: { app: "python", tier: "api" },
  },
  {
    name: "ingress-17",
    namespace: "default",
    host: "example17.com",
    paths: ["/path22"],
    labels: { app: "nodejs", tier: "frontend" },
  },
  {
    name: "ingress-18",
    namespace: "kube-system",
    host: "example18.com",
    paths: ["/path23"],
    labels: { app: "python", tier: "backend" },
  },
  {
    name: "ingress-19",
    namespace: "default",
    host: "example19.com",
    paths: ["/path24"],
    labels: { app: "flask", tier: "api" },
  },
  {
    name: "ingress-20",
    namespace: "kube-system",
    host: "example20.com",
    paths: ["/path25", "/path26"],
    labels: { app: "express", tier: "frontend" },
  },
];

export const Ingress = () => {
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [statefulSetDetails, setStatefulSetDetails] = useState([]);
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [checkboxes, setCheckboxes] = useState([
    { id: 1, label: "default", isChecked: false },
    { id: 2, label: "kube-system", isChecked: false },
    { id: 3, label: "production", isChecked: false },
    { id: 4, label: "staging", isChecked: false },
  ]);

  useEffect(() => {
    // 초기화 시 샘플 데이터를 사용
    setStatefulSetDetails(sampleData);
  }, []);

  const openDetailPopup = (row) => {
    setSelectedRow(row);
    setIsDetailPopupOpen(true);
  };

  const closeDetailPopup = () => {
    setIsDetailPopupOpen(false);
  };

  const openPopup = () => {
    setFilterPopupOpen(true);
  };

  const closePopup = () => {
    setFilterPopupOpen(false);
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

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
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

  const filteredData = statefulSetDetails.filter((item) => {
    const matchesSearchTerm = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const activeFilters = getActiveFilters();
    const matchesFilters =
      activeFilters.length === 0 || activeFilters.includes(item.namespace);
    return matchesSearchTerm && matchesFilters;
  });

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredData.length);
  const currentPageData = filteredData.slice(startIndex, endIndex);

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
            <h2>Ingress</h2>
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
                        filter //필터 상자
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
                  <button onClick={openPopup} className="button">
                    Filter
                  </button>
                </div>
                <CDBTable responsive>
                  <CDBTableHeader>
                    <tr className="table-header">
                      <th>NAME</th>
                      <th>NAMESPACE</th>
                      <th>HOST</th>
                      <th>PATHS</th>
                      <th>LABELS</th>
                    </tr>
                  </CDBTableHeader>
                  <CDBTableBody>
                    {currentPageData.map((row, index) => (
                      <tr key={index} onClick={() => openDetailPopup(row)}>
                        <td className="table-cell-ellipsis">{row.name}</td>
                        <td className="table-cell-ellipsis">{row.namespace}</td>
                        <td className="table-cell-ellipsis">{row.host}</td>
                        <td className="table-cell-ellipsis">
                          {row.paths.join(", ")}
                        </td>
                        <td className="table-cell-ellipsis">
                          {Object.entries(row.labels)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(", ")}
                        </td>
                      </tr>
                    ))}
                  </CDBTableBody>
                </CDBTable>

                <div className="pagination-container">
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

            {filterPopupOpen && (
              <div className="popup">
                <h2>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="close-button"
                    onClick={closePopup}
                  />
                  Select Filters
                </h2>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      checked={isSelectAllChecked}
                      onChange={handleSelectAllChange}
                    />
                    Select All
                  </label>
                  {checkboxes.map((checkbox) => (
                    <label key={checkbox.id}>
                      <input
                        type="checkbox"
                        checked={checkbox.isChecked}
                        onChange={() => handleCheckboxChange(checkbox.id)}
                      />
                      {checkbox.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
