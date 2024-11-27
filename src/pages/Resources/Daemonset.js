import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "../Node/Node.css";
import "./Resources.css";

import { fetchData, confirm } from "../Utils";

export const Daemonset = () => {
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [podDetails, setPodDetails] = useState([]);

  const {
    data: daemonsets,
    isLoading: loadingDaemon,
    error: errorDaemon,
  } = useQuery("daemonsets", () =>
    fetchData("http://localhost:8080/v1/daemonsets")
  );
  confirm(loadingDaemon, errorDaemon);

  useEffect(() => {
    if (!daemonsets || daemonsets.length === 0) return;

    const fetchPodMetrics = async () => {
      // Fetch detailed metrics for each pod
      const daemonMetricsPromises = daemonsets.map(async (daemonset) => {
        const podMetricsUrl = `http://localhost:8080/v1/daemonsets/${daemonset.namespace}/${daemonset.name}`;
        const podMetrics = await fetchData(podMetricsUrl);
        return {
          ...daemonset,
          desired: podMetrics.desired,
          creation_time: podMetrics.creation_time,
        };
      });

      // Wait for all metrics to be fetched
      const updatedDaemonSets = await Promise.all(daemonMetricsPromises);
      setPodDetails(updatedDaemonSets); // Store the updated pod details with metrics
    };

    fetchPodMetrics();
  }, [daemonsets]);

  if (loadingDaemon) return <p>Loading daemonsets...</p>;
  if (errorDaemon) return <p>Error loading daemonsets.</p>;

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
            <h2>Daemonset</h2>
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
                      <th>IMAGES</th>
                      <th>LABELS</th>
                      <th>DESIRED</th>
                      <th>CURRENT</th>
                      <th>READY</th>
                      <th>AVAILABLE</th>
                      <th>NODE_SELECTOR</th>
                      <th>CREATION_TIME</th>
                    </tr>
                  </CDBTableHeader>
                  <CDBTableBody>
                    {currentPageData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.name}</td>
                        <td>{row.namespace}</td>
                        <td>{row.images.join(", ")}</td>
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
                        <td>{row.desired}</td>
                        <td>{row.current}</td>
                        <td>{row.ready}</td>
                        <td>{row.available}</td>
                        <td>
                          {row.node_selector
                            ? Object.entries(row.node_selector).map(
                                ([key, value], i) => (
                                  <span key={i}>
                                    {key}: {value}
                                    {i <
                                    Object.entries(row.node_selector).length - 1
                                      ? ", "
                                      : ""}
                                  </span>
                                )
                              )
                            : "<none>"}
                        </td>
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
