import React, { useEffect, useState, useRef } from "react";
import { ForceGraph2D } from "react-force-graph";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { CDBBtn, CDBContainer, CDBBtnGrp } from "cdbreact";
import "./Topology.css";
import Dropdown from "./Dropdown/Dropdown";
import { useQuery } from "react-query";
import { fetchData, confirm } from "../Utils";

export const Topology = () => {
  const [nodes, setNodes] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [selectedNamespace, setSelectedNamespace] = useState("default");
  const [selectedMetric, setSelectedMetric] = useState("cpu_capacity"); // This can be 'cpu_capacity' or 'ram_capacity'
  const fgRef = useRef(); // Ref for accessing the force graph instance

  const {
    data: pods,
    isLoading: loadingPods,
    error: errorPods,
  } = useQuery("pods", () => fetchData("http://localhost:8080/v1/pods"));
  confirm(loadingPods, errorPods);

  useEffect(() => {
    const graphNodes = pods.map((pod, index) => {
      const angle = (2 * Math.PI * index) / pods.length;
      const radius = 70; // Adjust radius to spread out the nodes
      return {
        id: pod.name,
        name: pod.name,
        ip: pod.ip,
        status: pod.status,
        namespace: pod.namespace,
        images: pod.images.join(", "),
        labels: JSON.stringify(pod.labels),
        cpu_capacity: pod.cpu_capacity,
        ram_capacity: pod.ram_capacity,
        restarts: pod.restarts,
        x: -50 + radius * Math.cos(angle), // 400 is center offset
        y: -50 + radius * Math.sin(angle), // 400 is center offset
        fx: -50 + radius * Math.cos(angle),
        fy: -50 + radius * Math.sin(angle),
      };
    });

    setNodes(graphNodes);

    setNamespaces([...new Set(pods.map((pod) => pod.namespace))]);

    // setLinks(graphLinks);
  }, []);

  const handleNamespaceChange = (namespace) => {
    setSelectedNamespace(namespace);
  };

  const filteredNodes = nodes.filter(
    (node) => node.namespace === selectedNamespace
  );

  const handleNodeClick = (node) => {
    const tooltip = document.getElementById("tooltip");
    if (node) {
      const { x, y } = fgRef.current.graph2ScreenCoords(node.x, node.y);
      tooltip.style.display = "block";
      tooltip.style.left = `${x + 20}px`;
      tooltip.style.top = `${y}px`;
      tooltip.innerHTML = `
                <div class='close' onclick='this.parentElement.style.display="none";'>&times;</div>
                <h4>${node.name}</h4>
                <strong>Namespace:</strong> ${node.namespace}<br/>
                <strong>IP:</strong> ${node.ip}<br/>
                <strong>Status:</strong> ${node.status}<br/>

                <strong>Labels:</strong> <pre>${node.labels}</pre>
                <strong>Container Images:</strong> <pre>${node.images}</pre>
                <strong>Restarts:</strong> <pre>${node.restarts}</pre>
            `;
    }
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
            <h2>Topology</h2>
            <p>Kubernetes Cluster Topology</p>
          </div>
        </div>

        <div id="tooltip"></div>

        <div className="settings">
          <CDBContainer>
            <CDBBtnGrp>
              <CDBBtn
                color="primary"
                size="large"
                className={selectedMetric === "cpu_capacity" ? "active" : ""}
                onClick={() => setSelectedMetric("cpu_capacity")}
                style={{ marginRight: "10px" }}
              >
                CPU
              </CDBBtn>
              <CDBBtn
                color="primary"
                size="large"
                className={selectedMetric === "ram_capacity" ? "active" : ""}
                onClick={() => setSelectedMetric("ram_capacity")}
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

        <ForceGraph2D
          ref={fgRef}
          graphData={{ nodes: filteredNodes, links: [] }}
          nodeLabel="name"
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 12 / globalScale;
            const radius = 10; // The radius for the nodes
            const metricValue = node[selectedMetric]; // Default to 0 if not specified

            // Draw the outer circle (border)
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2, false);
            ctx.fillStyle = "rgba(220, 220, 220, 0.9)"; // Light grey for the "empty" part
            ctx.fill();

            // Clipping area for the fill
            if (node[selectedMetric]) {
              ctx.save(); // Save the current context state
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius, 0, Math.PI * 2, true);
              ctx.clip(); // Clip to the path

              // Draw the filled part from the bottom
              ctx.beginPath();
              ctx.rect(
                node.x - radius,
                node.y + radius,
                radius * 2,
                -radius * 2 * (metricValue / 100)
              );
              ctx.fillStyle = "rgba(0, 123, 255, 0.9)"; // Blue color for the filled part
              ctx.fill();

              ctx.restore(); // Restore the original state (removes clipping)
            }

            // Draw the node label below the node
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#000";
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillText(label, node.x, node.y + radius + 5); // Adjust label position to be below the node
          }}
          onNodeClick={handleNodeClick}
        />
      </div>
    </div>
  );
};
