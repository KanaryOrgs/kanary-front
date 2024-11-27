import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "../Node/Node.css";
import "./Resources.css";

import { fetchData, confirm } from "../Utils";

export const StatefulSet = () => {
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [podDetails, setPodDetails] = useState([]);

  const {
    data: sfs,
    isLoading: loadingSfs,
    error: errorSfs,
  } = useQuery("sfs", () => fetchData("http://localhost:8080/v1/statefulsets"));
  confirm(loadingSfs, errorSfs);

  useEffect(() => {
    if (!sfs || sfs.length === 0) return;

    const fetchStatefulMetrics = async () => {
      // Fetch detailed metrics for each pod
      const sfsMetricsPromises = sfs.map(async (sfs) => {
        const sfsMetricsUrl = `http://localhost:8080/v1/statefulsets/${sfs.namespace}/${sfs.name}`;
        const sfsMetrics = await fetchData(sfsMetricsUrl);
        return {
          ...sfs,
          creation_time: sfsMetrics.creation_time,
        };
      });

      // Wait for all metrics to be fetched
      const updatedsfs = await Promise.all(sfsMetricsPromises);
      setPodDetails(updatedsfs); // Store the updated pod details with metrics
    };

    fetchStatefulMetrics();
  }, [sfs]);

  if (loadingSfs) return <p>Loading sfs...</p>;
  if (errorSfs) return <p>Error loading sfs.</p>;

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  // 검색 필터링
  const filteredData = podDetails
    ? podDetails.filter((pod) =>
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
            <h2>Statefulset</h2>
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
                      <th>REPLICAS</th>
                      <th>READY</th>
                      <th>LABELS</th>
                      <th>CREATION TIME</th>
                    </tr>
                  </CDBTableHeader>
                  <CDBTableBody>
                    {currentPageData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.name}</td>
                        <td>{row.namespace}</td>
                        <td>{row.replicas}</td>
                        <td>{row.ready}</td>
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
                        {/* <td>
                          <span className={`badge ${statusColors[row.status]}`}>
                            {row.status}
                          </span>
                        </td> */}

                        <td>
                          {row.creation_time
                            ? new Date(row.creation_time).toUTCString()
                            : ""}
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
