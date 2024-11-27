import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "../Node/Node.css";
import "./Resources.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Square15, Square4 } from "../Node/Squares";
import { fetchData, confirm } from "../Utils";

const statusColors = {
  Stop: "badge-stop",
  Running: "badge-running",
  Pending: "badge-pending",
  Available: "badge-available",
  Bound: "badge-bound",
};

export const Volume = () => {
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [dataType, setDataType] = useState("PersistentVolume");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false); // 디테일 팝업 상태
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [data, setData] = useState([]);
  const {
    data: pvs,
    isLoading: loadingPvs,
    error: errorPvs,
  } = useQuery("pvs", () => fetchData("http://localhost:8080/v1/pvs"), {
    enabled: dataType === "PersistentVolume", // PersistentVolume일 때만 실행
  });
  confirm(loadingPvs, errorPvs);

  const {
    data: pvcs,
    isLoading: loadingPvcs,
    error: errorPvcs,
  } = useQuery("pvcs", () => fetchData("http://localhost:8080/v1/pvcs"), {
    enabled: dataType === "PersistentVolumeClaim", // PersistentVolume일 때만 실행
  });
  confirm(loadingPvcs, errorPvcs);

  const {
    data: scs,
    isLoading: loadingScs,
    error: errorScs,
  } = useQuery(
    "scs",
    () => fetchData("http://localhost:8080/v1/storageclasses"),
    {
      enabled: dataType === "StorageClass", // PersistentVolume일 때만 실행
    }
  );
  confirm(loadingScs, errorScs);

  // 상태 업데이트: 로딩 중에도 이전 데이터를 유지
  const openDetailPopup = async (row) => {
    setIsDetailPopupOpen(true); // 팝업 열기
    setLoadingDetail(true); // 로딩 시작
    if (dataType == "PersistentVolume") {
      try {
        const detailUrl = `http://localhost:8080/v1/pvs/${row.name}`;
        const detailData = await fetchData(detailUrl);

        // 로딩 중에도 이전 데이터를 덮어씌우지 않음
        setSelectedRow((prev) => ({
          ...prev,
          ...row,
          ...detailData,
        }));
      } catch (error) {
        console.error("Error fetching pod details:", error);
      } finally {
        setLoadingDetail(false); // 로딩 종료
      }
    }
    if (dataType == "PersistentVolumeClaim") {
      try {
        const detailUrl = `http://localhost:8080/v1/pvcs/${row.namespace}/${row.name}`;
        const detailData = await fetchData(detailUrl);

        // 로딩 중에도 이전 데이터를 덮어씌우지 않음
        setSelectedRow((prev) => ({
          ...prev,
          ...row,
          ...detailData,
        }));
      } catch (error) {
        console.error("Error fetching pod details:", error);
      } finally {
        setLoadingDetail(false); // 로딩 종료
      }
    }
    if (dataType == "StorageClass") {
      try {
        const detailUrl = `http://localhost:8080/v1/storageclasses/${row.name}`;
        const detailData = await fetchData(detailUrl);

        // 로딩 중에도 이전 데이터를 덮어씌우지 않음
        setSelectedRow((prev) => ({
          ...prev,
          ...row,
          ...detailData,
        }));
      } catch (error) {
        console.error("Error fetching pod details:", error);
      } finally {
        setLoadingDetail(false); // 로딩 종료
      }
    }
  };

  useEffect(() => {
    // 초기 데이터 설정
    if (dataType === "PersistentVolume" && pvs) {
      setData(pvs);
    } else if (dataType === "PersistentVolumeClaim" && pvcs) {
      setData(pvcs);
    } else if (dataType === "StorageClass" && scs) {
      setData(scs);
    }
  }, [dataType, pvs, pvcs, scs]);

  const handleDataTypeChange = (type) => {
    setDataType(type); // 데이터 타입 변경
    setSearchTerm(""); // 검색어 초기화
    setCurrentPage(1); // 페이지 초기화

    // 데이터 동기화
    if (type === "PersistentVolume" && pvs) {
      setData(pvs);
    } else if (type === "PersistentVolumeClaim" && pvcs) {
      setData(pvcs);
    } else if (type === "StorageClass" && scs) {
      setData(scs);
    }
  };

  if (
    (dataType === "PersistentVolume" && loadingPvs) ||
    (dataType === "PersistentVolumeClaim" && loadingPvcs) ||
    (dataType === "StorageClass" && loadingScs)
  )
    return <p>Loading...</p>;

  if (
    (dataType === "PersistentVolume" && errorPvs) ||
    (dataType === "PersistentVolumeClaim" && errorPvcs) ||
    (dataType === "StorageClass" && errorScs)
  )
    return <p>Error loading data.</p>;

  const closeDetailPopup = () => {
    setIsDetailPopupOpen(false);
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  // 검색 필터링
  const filteredData = data
    ? data.filter((d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h2>Volume</h2>
            <p>Kubernetes Cluster Resources</p>
          </div>
        </div>

        <div className="node-container">
          <div className="content-wrapper">
            <div className="grid-wrapper">
              <div className="mt-5">
                {/* 데이터 타입 선택 버튼 */}
                <div className="button-group">
                  <button
                    onClick={() => handleDataTypeChange("PersistentVolume")}
                    className={`data-type-button ${
                      dataType === "PersistentVolume" ? "data-type-active" : ""
                    }`}
                  >
                    Persistent Volume
                  </button>
                  <button
                    onClick={() =>
                      handleDataTypeChange("PersistentVolumeClaim")
                    }
                    className={`data-type-button ${
                      dataType === "PersistentVolumeClaim"
                        ? "data-type-active"
                        : ""
                    }`}
                  >
                    Persistent Volume Claim
                  </button>
                  <button
                    onClick={() => handleDataTypeChange("StorageClass")}
                    className={`data-type-button ${
                      dataType === "StorageClass" ? "data-type-active" : ""
                    }`}
                  >
                    Storage Class
                  </button>
                </div>
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
                      {dataType === "PersistentVolume" && (
                        <>
                          <th>NAME</th>
                          <th>CAPACITY</th>
                          <th>ACCESS MODE</th>
                          <th>RECLAIM POLICY</th>
                          <th>STATUS</th>
                          <th>LABELS</th>
                        </>
                      )}
                      {dataType === "PersistentVolumeClaim" && (
                        <>
                          <th>NAME</th>
                          <th>NAMESPACE</th>
                          <th>VOLUME NAME</th>
                          <th>ACCESS MODES</th>
                          <th>STATUS</th>
                          <th>LABELS</th>
                        </>
                      )}
                      {dataType === "StorageClass" && (
                        <>
                          <th>NAME</th>
                          <th>PROVISIONER</th>
                          <th>RECLAIM POLICY</th>
                          <th>ALLOW EXPANSION</th>
                          <th>LABELS</th>
                        </>
                      )}
                    </tr>
                  </CDBTableHeader>
                  <CDBTableBody>
                    {currentPageData.map((row, index) => (
                      <tr key={index} onClick={() => openDetailPopup(row)}>
                        <td className="table-cell-ellipsis">{row.name}</td>
                        {dataType === "PersistentVolume" && (
                          <>
                            <td className="table-cell-ellipsis">
                              {row.capacity.storage}
                            </td>
                            <td className="table-cell-ellipsis">
                              {row.access_modes}
                            </td>
                            <td className="table-cell-ellipsis">
                              {row.reclaim_policy}
                            </td>
                            <td>
                              <span
                                className={`badge ${statusColors[row.status]}`}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td className="table-cell-ellipsis">
                              {row.labels
                                ? Object.entries(row.labels)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(", ")
                                : "<none>"}
                            </td>
                          </>
                        )}
                        {dataType === "PersistentVolumeClaim" && (
                          <>
                            <td className="table-cell-ellipsis">
                              {row.namespace}
                            </td>
                            <td className="table-cell-ellipsis">
                              {row.volume_name}
                            </td>
                            <td className="table-cell-ellipsis">
                              {row.access_modes.join(", ")}
                            </td>
                            <td>
                              <span
                                className={`badge ${statusColors[row.status]}`}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td className="table-cell-ellipsis">
                              {row.labels
                                ? Object.entries(row.labels)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(", ")
                                : "<none>"}
                            </td>
                          </>
                        )}
                        {dataType === "StorageClass" && (
                          <>
                            <td className="table-cell-ellipsis">
                              {row.provisioner}
                            </td>
                            <td className="table-cell-ellipsis">
                              {row.reclaim_policy}
                            </td>
                            <td className="table-cell-ellipsis">
                              {row.allowVolumeExpansion ? "TRUE" : "FALSE"}
                            </td>
                            <td className="table-cell-ellipsis">
                              {row.labels
                                ? Object.entries(row.labels)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(", ")
                                : "<none>"}
                            </td>
                          </>
                        )}
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

            {isDetailPopupOpen && (
              <div className={`popup ${isDetailPopupOpen ? "open" : ""}`}>
                <h2>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="close-button"
                    onClick={closeDetailPopup}
                  />
                  {selectedRow?.name || "Loading..."}
                </h2>
                <div
                  className={`popup-content ${loadingDetail ? "loading" : ""}`}
                >
                  {dataType === "PersistentVolume" && selectedRow && (
                    <>
                      <Square15 topLeftText="Capacity">
                        {selectedRow.capacity
                          ? selectedRow.capacity.storage
                          : ""}
                      </Square15>
                      <Square15 topLeftText="Access Modes">
                        {selectedRow.access_modes
                          ? selectedRow.access_modes.join(", ")
                          : ""}
                      </Square15>
                      <Square15 topLeftText="Reclaim Policy">
                        {selectedRow.reclaim_policy}
                      </Square15>
                      <Square15 topLeftText="Status">
                        {selectedRow.status}
                      </Square15>
                      <Square15 topLeftText="Storage Class">
                        {selectedRow.storage_class}
                      </Square15>
                      <Square4 topLeftText="Creation Time">
                        <td>
                          {selectedRow.creation_time
                            ? new Date(selectedRow.creation_time).toUTCString()
                            : ""}
                        </td>
                      </Square4>
                      <Square4 topLeftText="Labels">
                        {selectedRow.labels ? (
                          <ul className="labels-list">
                            {Object.entries(selectedRow.labels).map(
                              ([key, value], index) => (
                                <li key={index}>
                                  <strong>{key}</strong>: {value || "<none>"}
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          "N/A"
                        )}
                      </Square4>
                    </>
                  )}

                  {dataType === "PersistentVolumeClaim" && selectedRow && (
                    <>
                      <Square15 topLeftText="Namespace">
                        {selectedRow.namespace}
                      </Square15>
                      <Square15 topLeftText="Access Modes">
                        {selectedRow.access_modes
                          ? selectedRow.access_modes.join(", ")
                          : ""}
                      </Square15>
                      <Square15 topLeftText="Status">
                        {selectedRow.status}
                      </Square15>
                      <Square15 topLeftText="Storage Request">
                        {selectedRow.storage_request
                          ? Object.entries(selectedRow.storage_request)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")
                          : "<none>"}
                      </Square15>
                      <Square4 topLeftText="Creation Time">
                        <td>
                          {selectedRow.creation_time
                            ? new Date(selectedRow.creation_time).toUTCString()
                            : ""}
                        </td>
                      </Square4>
                      <Square4 topLeftText="Volume Name">
                        {selectedRow.volume_name}
                      </Square4>
                      <Square4 topLeftText="Labels">
                        {selectedRow.labels ? (
                          <ul className="labels-list">
                            {Object.entries(selectedRow.labels).map(
                              ([key, value], index) => (
                                <li key={index}>
                                  <strong>{key}</strong>: {value || "<none>"}
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          "N/A"
                        )}
                      </Square4>
                    </>
                  )}

                  {dataType === "StorageClass" && selectedRow && (
                    <>
                      <Square15 topLeftText="Provisioner">
                        {selectedRow.provisioner}
                      </Square15>
                      <Square15 topLeftText="Reclaim Policy">
                        {selectedRow.reclaim_policy}
                      </Square15>
                      <Square15 topLeftText="Allow Volume Expansion">
                        {selectedRow.allowVolumeExpansion ? "Yes" : "No"}
                      </Square15>
                      <Square4 topLeftText="Creation Time">
                        <td>
                          {selectedRow.creation_time
                            ? new Date(selectedRow.creation_time).toUTCString()
                            : ""}
                        </td>
                      </Square4>
                      <Square4 topLeftText="Labels">
                        {selectedRow.labels ? (
                          <ul className="labels-list">
                            {Object.entries(selectedRow.labels).map(
                              ([key, value], index) => (
                                <li key={index}>
                                  <strong>{key}</strong>: {value || "<none>"}
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          "N/A"
                        )}
                      </Square4>
                      <Square4 topLeftText="Parameters">
                        {selectedRow.parameters &&
                        Object.keys(selectedRow.parameters).length > 0
                          ? Object.entries(selectedRow.parameters)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")
                          : "<none>"}
                      </Square4>
                    </>
                  )}
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
