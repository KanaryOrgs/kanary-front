import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import "./Node.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export const Resources = () => {
  // 샘플 데이터
  const sampleData = [
    {
      name: "Apdule-arm-test-cluster",
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

  const pageSize = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [checkboxes, setCheckboxes] = useState([
    { id: 1, label: "a", isChecked: false },
    { id: 2, label: "b", isChecked: false },
    { id: 3, label: "c", isChecked: false },
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

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredData.length);
  const currentPageData = filteredData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    cursor: "pointer",
    color: "#FFFFFF",
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
        <div className="event-content">
          <div className="event-header">
            <div>
              <h2>Resources</h2>
              <p></p>
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
                gridTemplateColumns: "repeat(1, minmax(200px, 100%))",
              }}
            >
              <div className="mt-5">
                <div
                  style={{
                    marginBottom: "13px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {getActiveFilters().map((filter) => (
                      <div
                        key={filter}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: "#004098",
                          color: "white",
                          borderRadius: "4px",
                          padding: "5px 10px",
                          marginRight: "10px",
                          marginBottom: "5px",
                        }}
                      >
                        <span>{filter}</span>
                        <FontAwesomeIcon
                          icon={faTimes}
                          style={{ marginLeft: "5px", cursor: "pointer" }}
                          onClick={() => handleRemoveFilter(filter)}
                        />
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{
                      paddingRight: "10px",
                      paddingLeft: "10px",
                      flex: "1",
                      marginRight: "10px",
                    }}
                  />
                  <button
                    onClick={openPopup}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#004098",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Filter
                  </button>
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
                      <tr key={index}>
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
                        border: "none",
                        borderRadius: "4px",
                        backgroundColor:
                          currentPage === page + 1 ? "#004098" : "#1F2838",
                        color: "white",
                        margin: "0 5px",
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
                    style={closeButtonStyle}
                    onClick={closePopup}
                  />{" "}
                  Select Filters
                </h2>
                <div
                  style={{ overflowY: "auto", maxHeight: "calc(100vh - 15%)" }}
                >
                  <div>
                    <input
                      type="checkbox"
                      checked={isSelectAllChecked}
                      onChange={handleSelectAllChange}
                    />
                    <label>Select All</label>
                  </div>
                  <div style={{ padding: "10px 0" }}>
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
            <footer className="footer">
              <div className="d-flex align-items-center"></div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
