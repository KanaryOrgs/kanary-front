import React, { useEffect, useState, useRef } from "react";
import { ForceGraph2D } from "react-force-graph";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import "./Topology.css";
import { useQuery } from "react-query";
import { fetchData, confirm, PodTooltip } from "../Utils";
import TopologyControls from "./TopologyControls";
import PodForceGraph from "./PodForceGraph";

export const Topology = () => {
  const [podDetails, setPodDetails] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [selectedNamespace, setSelectedNamespace] = useState("default");
  const [selectedMetric, setSelectedMetric] = useState("cpu_usage"); // This can be 'cpu_usage' or 'mem_usage'
  const fgRef = useRef(); // Ref for accessing the force graph instance

  const {
    data: pods,
    isLoading: loadingPods,
    error: errorPods,
  } = useQuery("pods", () => fetchData("http://localhost:8080/v1/pods"));
  confirm(loadingPods, errorPods);

  useEffect(() => {
    if (!pods || pods.length === 0) return; // pods가 존재하지 않거나 비어 있으면 리턴
    // 네임스페이스 선택 시 해당 네임스페이스에 있는 파드들만 가져오기
    const loadPodMetrics = async () => {
      const filteredPods = pods.filter(
        (pod) => pod.namespace === selectedNamespace
      );
      const promises = filteredPods.map(async (pod) => {
        const podMetricsUrl = `http://localhost:8080/v1/pods/${pod.namespace}/${pod.name}`;
        const podMetrics = await fetchData(podMetricsUrl);
        return {
          ...pod,
          cpu_usage: podMetrics.cpu_usage,
          mem_usage: podMetrics.mem_usage,
        };
      });

      const updatedPods = await Promise.all(promises);

      const podsPerRow = 5; // 한 행에 표시할 노드 수
      const podSpacing = 80; // 노드 간의 간격
      const rowSpacing = 60; // 행 간의 간격

      // 전체 노드의 총 너비와 높이를 계산
      const totalWidth = (podsPerRow - 1) * podSpacing;
      const totalHeight = Math.ceil(pods.length / podsPerRow) * rowSpacing;

      setPodDetails(
        updatedPods.map((pod, index) => ({
          ...pod,
          x: (index % podsPerRow) * podSpacing - totalWidth / 2,
          y: Math.floor(index / podsPerRow) * rowSpacing - totalHeight / 2,
          fx: (index % podsPerRow) * podSpacing - totalWidth / 2,
          fy: Math.floor(index / podsPerRow) * rowSpacing - totalHeight / 2,
        }))
      );
      setNamespaces([...new Set(pods.map((pod) => pod.namespace))]);
    };

    loadPodMetrics();
  }, [pods, selectedNamespace]);

  const handleNamespaceChange = (namespace) => setSelectedNamespace(namespace);

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
        <TopologyControls
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
          namespaces={namespaces}
          selectedNamespace={selectedNamespace}
          handleNamespaceChange={handleNamespaceChange}
        />

        <PodForceGraph
          podDetails={podDetails}
          selectedMetric={selectedMetric}
          fgRef={fgRef}
          onPodClick={(node) => PodTooltip({ pod: node, fgRef })}
        />
      </div>
    </div>
  );
};
