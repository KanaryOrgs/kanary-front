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
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 필터 팝업 상태
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false); // 디테일 팝업 상태
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [checkboxes, setCheckboxes] = useState([
    { id: 1, label: "nginx", isChecked: false },
    { id: 2, label: "kube", isChecked: false },
    { id: 3, label: "etcd", isChecked: false },
    // Add more checkboxes as needed
  ]);
  const [data, setData] = useState([]);

  const {
    data: pvs,
    isLoading: loadingPvs,
    error: errorPvs,
    refetch: refetchPvs,
  } = useQuery("pvs", () => fetchData("http://localhost:8080/v1/pvs"), {
    enabled: dataType === "PersistentVolume", // PersistentVolume일 때만 실행
  });
  confirm(loadingPvs, errorPvs);

  const {
    data: pvcs,
    isLoading: loadingPvcs,
    error: errorPvcs,
    refetch: refetchPvcs,
  } = useQuery("pvcs", () => fetchData("http://localhost:8080/v1/pvcs"), {
    enabled: dataType === "PersistentVolumeClaim", // PersistentVolume일 때만 실행
  });
  confirm(loadingPvcs, errorPvcs);

  const {
    data: scs,
    isLoading: loadingScs,
    error: errorScs,
    refetch: refetchScs,
  } = useQuery(
    "scs",
    () => fetchData("http://localhost:8080/v1/storageclasses"),
    {
      enabled: dataType === "StorageClass", // PersistentVolume일 때만 실행
    }
  );
  confirm(loadingScs, errorScs);

  // PV
  useEffect(() => {
    // 데이터 타입이 PersistentVolume이 아닌 경우 early return
    if (dataType !== "PersistentVolume") return;

    // 데이터가 없거나 로딩 중이면 실행하지 않음
    if (!pvs || pvs.length === 0) {
      refetchPvs(); // 데이터를 다시 가져오기 위해 refetch 호출
      return;
    }

    const fetchPvMetrics = async () => {
      // Fetch detailed metrics for each pod
      const pvsMetricsPromises = pvs.map(async (pv) => {
        const pvsMetricsUrl = `http://localhost:8080/v1/pvs/${pv.name}`;
        const pvsMetrics = await fetchData(pvsMetricsUrl);
        return {
          ...pv,
          creation_time: pvsMetrics.creation_time,
          storage_class: pvsMetrics.storage_class,
        };
      });

      // Wait for all metrics to be fetched
      const updatedPvs = await Promise.all(pvsMetricsPromises);
      setData(updatedPvs); // Store the updated pod details with metrics
    };

    fetchPvMetrics();
  }, [dataType, pvs, refetchPvs]);

  // PVC
  useEffect(() => {
    // 데이터 타입이 PersistentVolume이 아닌 경우 early return
    if (dataType !== "PersistentVolumeClaim") return;

    // 데이터가 없거나 로딩 중이면 실행하지 않음
    if (!pvcs || pvcs.length === 0) {
      refetchPvcs(); // 데이터를 다시 가져오기 위해 refetch 호출
      return;
    }

    const fetchPvcMetrics = async () => {
      // Fetch detailed metrics for each pod
      const pvcsMetricsPromises = pvcs.map(async (pvc) => {
        const pvcsMetricsUrl = `http://localhost:8080/v1/pvcs/${pvc.namespace}/${pvc.name}`;
        const pvcsMetrics = await fetchData(pvcsMetricsUrl);
        return {
          ...pvc,
          creation_time: pvcsMetrics.creation_time,
          storage_request: pvcsMetrics.storage_request,
        };
      });

      // Wait for all metrics to be fetched
      const updatedPvcs = await Promise.all(pvcsMetricsPromises);
      setData(updatedPvcs); // Store the updated pod details with metrics
    };

    fetchPvcMetrics();
  }, [dataType, pvcs, refetchPvcs]);

  // SC
  useEffect(() => {
    // 데이터 타입이 PersistentVolume이 아닌 경우 early return
    if (dataType !== "StorageClass") return;

    // 데이터가 없거나 로딩 중이면 실행하지 않음
    if (!scs || scs.length === 0) {
      refetchScs(); // 데이터를 다시 가져오기 위해 refetch 호출
      return;
    }

    const fetchScMetrics = async () => {
      // Fetch detailed metrics for each pod
      const scsMetricsPromises = scs.map(async (sc) => {
        const scsMetricsUrl = `http://localhost:8080/v1/storageclasses/${sc.name}`;
        const scsMetrics = await fetchData(scsMetricsUrl);
        return {
          ...sc,
          creation_time: scsMetrics.creation_time,
          parameters: scsMetrics.parameters,
        };
      });

      // Wait for all metrics to be fetched
      const updatedScs = await Promise.all(scsMetricsPromises);
      setData(updatedScs); // Store the updated pod details with metrics
    };

    fetchScMetrics();
  }, [dataType, scs, refetchScs]);

  // 데이터 타입 변경 핸들러
  const handleDataTypeChange = (type) => {
    setDataType(type);
    if (type === "PersistentVolume") setData(pvs);
    if (type === "PersistentVolumeClaim") setData(pvcs);
    if (type === "StorageClass") setData(scs);
    setSearchTerm(""); // 검색어 초기화
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

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const openDetailPopup = (row) => {
    setSelectedRow(row);
    setIsDetailPopupOpen(true);
  };

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

  const filteredData = data
    ? data.filter((item) => {
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
            <h2>Resources-Volume</h2>
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
                  {dataType === "PersistentVolume" && selectedRow && (
                    <>
                      <Square15 topLeftText="Name">{selectedRow.name}</Square15>
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
                      <Square15 topLeftText="Creation Time">
                        {selectedRow.creation_time}
                      </Square15>
                      <Square4 topLeftText="Labels">
                        {selectedRow.labels
                          ? Object.entries(selectedRow.labels)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")
                          : "<none>"}
                      </Square4>
                    </>
                  )}

                  {dataType === "PersistentVolumeClaim" && selectedRow && (
                    <>
                      <Square15 topLeftText="Name">{selectedRow.name}</Square15>
                      <Square15 topLeftText="Namespace">
                        {selectedRow.namespace}
                      </Square15>
                      <Square15 topLeftText="Volume Name">
                        {selectedRow.volume_name}
                      </Square15>
                      <Square15 topLeftText="Access Modes">
                        {selectedRow.access_modes
                          ? selectedRow.access_modes.join(", ")
                          : ""}
                      </Square15>
                      <Square15 topLeftText="Status">
                        {selectedRow.status}
                      </Square15>
                      <Square15 topLeftText="Creation Time">
                        {selectedRow.creation_time}
                      </Square15>
                      <Square15 topLeftText="Storage Request">
                        {selectedRow.storage_request
                          ? Object.entries(selectedRow.storage_request)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")
                          : "<none>"}
                      </Square15>
                      <Square4 topLeftText="Labels">
                        {selectedRow.labels
                          ? Object.entries(selectedRow.labels)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")
                          : "<none>"}
                      </Square4>
                    </>
                  )}

                  {dataType === "StorageClass" && selectedRow && (
                    <>
                      <Square15 topLeftText="Name">{selectedRow.name}</Square15>
                      <Square15 topLeftText="Provisioner">
                        {selectedRow.provisioner}
                      </Square15>
                      <Square15 topLeftText="Reclaim Policy">
                        {selectedRow.reclaim_policy}
                      </Square15>
                      <Square15 topLeftText="Allow Volume Expansion">
                        {selectedRow.allowVolumeExpansion ? "Yes" : "No"}
                      </Square15>
                      <Square15 topLeftText="Creation Time">
                        {selectedRow.creation_time}
                      </Square15>
                      <Square4 topLeftText="Labels">
                        {selectedRow.labels
                          ? Object.entries(selectedRow.labels)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")
                          : "<none>"}
                      </Square4>
                      <Square4 topLeftText="Parameters">
                        {selectedRow.parameters
                          ? Object.entries(selectedRow.parameters)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")
                          : ""}
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
