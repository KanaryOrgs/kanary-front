// TopologyControls.js
import React from "react";
import { CDBBtn, CDBContainer, CDBBtnGrp } from "cdbreact";
import Dropdown from "./Dropdown/Dropdown";

const TopologyControls = ({
  selectedMetric,
  setSelectedMetric,
  namespaces,
  selectedNamespace,
  handleNamespaceChange,
}) => (
  <div className="settings">
    <CDBContainer>
      <CDBBtnGrp>
        <CDBBtn
          color="primary"
          size="large"
          className={selectedMetric === "cpu_usage" ? "active" : ""}
          onClick={() => setSelectedMetric("cpu_usage")}
          style={{ marginRight: "10px" }}
        >
          CPU
        </CDBBtn>
        <CDBBtn
          color="primary"
          size="large"
          className={selectedMetric === "mem_usage" ? "active" : ""}
          onClick={() => setSelectedMetric("mem_usage")}
          style={{ marginRight: "10px" }}
        >
          Memory
        </CDBBtn>
      </CDBBtnGrp>
    </CDBContainer>
    <div className="dropdown">
      <Dropdown
        label={`Namespace: ${selectedNamespace || "Select"}`}
        items={namespaces}
        onSelect={handleNamespaceChange}
      />
    </div>
  </div>
);

export default TopologyControls;
