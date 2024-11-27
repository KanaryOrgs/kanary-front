import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "../Node/Node.css";
import "./Resources.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { fetchData, confirm } from "../Utils";

export const Ingress = () => {
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: ingresses,
    isLoading: loadingIngresses,
    error: errorIngresses,
  } = useQuery("ingresses", () =>
    fetchData("http://localhost:8080/v1/ingresses")
  );
  confirm(loadingIngresses, errorIngresses);

  if (loadingIngresses) return <p>Loading ingresses...</p>;
  if (errorIngresses) return <p>Error loading ingresses.</p>;

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  // 검색 필터링
  const filteredData = ingresses
    ? ingresses.filter((pod) =>
        pod.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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
                      <th>HOST</th>
                      <th>PATHS</th>
                      <th>LABELS</th>
                    </tr>
                  </CDBTableHeader>
                  <CDBTableBody>
                    {currentPageData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.name}</td>
                        <td>{row.namespace}</td>
                        <td>{row.host}</td>
                        <td>
                          {row.paths
                            ? Object.entries(row.paths)
                                .map(([key, value]) => `${value}`)
                                .join(", ")
                            : "<none>"}
                        </td>
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
