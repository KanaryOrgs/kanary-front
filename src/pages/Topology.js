import React, { useEffect, useState, useRef } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import "./Topology.css"

export const Topology = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const fgRef = useRef(); // Ref for accessing the force graph instance

  useEffect(() => {
    // Example pod data as fetched from the backend
    const podData = [
        {
          "name": "coredns-76f75df574-tpdg5",
          "namespace": "kube-system",
          "images": ["registry.k8s.io/coredns/coredns:v1.11.1"],
          "status": "Running",
          "labels": {
            "k8s-app": "kube-dns",
            "pod-template-hash": "76f75df574"
          }
        },
        {
          "name": "coredns-76f75df574-x72z8",
          "namespace": "kube-system",
          "images": ["registry.k8s.io/coredns/coredns:v1.11.1"],
          "status": "Running",
          "labels": {
            "k8s-app": "kube-dns",
            "pod-template-hash": "76f75df574"
          }
        },
        {
          "name": "etcd-master",
          "namespace": "kube-system",
          "images": ["registry.k8s.io/etcd:3.5.12-0"],
          "status": "Running",
          "labels": {
            "component": "etcd",
            "tier": "control-plane"
          }
        },
        {
          "name": "kube-apiserver-master",
          "namespace": "default",
          "images": ["registry.k8s.io/kube-apiserver:v1.29.4"],
          "status": "Running",
          "labels": {
            "component": "kube-apiserver",
            "tier": "control-plane"
          }
        },
        {
            "name": "nginx",
            "namespace": "nginx",
            "images": ["nginx"],
            "status": "Running",
            "labels": {
              "component": "nginx",
              "tier": "nginx"
            },
            "utilization": 24
          },
        {
            "name": "nginx1",
            "namespace": "nginx",
            "images": ["nginx1"],
            "status": "Running",
            "labels": {
                "component": "nginx1",
                "tier": "nginx1"
            },
            "utilization": 6
            },
            {
                "name": "nginx2",
                "namespace": "nginx",
                "images": ["nginx2"],
                "status": "Running",
                "labels": {
                    "component": "nginx2",
                    "tier": "nginx2"
            },
            "utilization": 24
            },
            {
                "name": "nginx3",
                "namespace": "nginx",
                "images": ["nginx3"],
                "status": "Running",
                "labels": {
                    "component": "nginx3",
                    "tier": "nginx3"
            },
            "utilization": 10
            },
      ];

      const graphNodes = podData.map(pod => ({
        id: pod.name,
        name: pod.name,
        status: pod.status,
        namespace: pod.namespace,
        images: pod.images.join(", "),
        labels: JSON.stringify(pod.labels),
        utilization: pod.utilization
      }));
  
      const graphLinks = [];
      graphNodes.forEach((node, idx) => {
        graphNodes.forEach((otherNode, otherIdx) => {
          if (idx !== otherIdx && node.namespace === otherNode.namespace) {
            graphLinks.push({ source: node.id, target: otherNode.id });
          }
        });
      });
  
      setNodes(graphNodes);
      setLinks(graphLinks);
    }, []);


  
    const handleNodeClick = node => {
        const tooltip = document.getElementById('tooltip');
        if (node) {
            const { x, y } = fgRef.current.graph2ScreenCoords(node.x, node.y);
            tooltip.style.display = 'block';
            tooltip.style.left = `${x + 20}px`;
            tooltip.style.top = `${y}px`;
            tooltip.innerHTML = `
                <div class='close' onclick='this.parentElement.style.display="none";'>&times;</div>
                <h4>${node.name}</h4>
                <strong>Namespace:</strong> ${node.namespace}<br/>
                <strong>Status:</strong> ${node.status}<br/>
                <strong>Utilization:</strong> ${node.utilization}%<br/>
                <strong>Labels:</strong> <pre>${node.labels}</pre>
                <strong>Container Images:</strong> <pre>${node.images}</pre>
            `;
        }
    };
  
    return (
      <div className="d-flex E">
        <div><Sidebar/></div>
        <div style={{flex: "1 1 auto", display: "flex", flexFlow: "column", height: "100vh", overflowY: "hidden"}}>
          <Navbar/>
          <div style={{height: "100%", overflowY: "auto"}}>
            <div id="tooltip"></div>
            <ForceGraph2D
              ref={fgRef}
              graphData={{ nodes, links }}
              nodeLabel="name"
              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.name;
                const fontSize = 12 / globalScale;
                const radius = 10; // The radius for the nodes
                const utilization = node.utilization || 0; // Default to 0 if not specified
              
                // Draw the outer circle (border)
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, Math.PI * 2, false);
                ctx.fillStyle = 'rgba(220, 220, 220, 0.9)'; // Light grey for the "empty" part
                ctx.fill();
              
                // Clipping area for the fill
                if (utilization > 0) {
                  ctx.save(); // Save the current context state
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, radius, 0, Math.PI * 2, true);
                  ctx.clip(); // Clip to the path
              
                  // Draw the filled part from the bottom
                  ctx.beginPath();
                  ctx.rect(node.x - radius, node.y + radius, radius * 2, -radius * 2 * (utilization / 100));
                  ctx.fillStyle = 'rgba(0, 123, 255, 0.9)'; // Blue color for the filled part
                  ctx.fill();
              
                  ctx.restore(); // Restore the original state (removes clipping)
                }
              
                // Draw the node label below the node
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = "#000";
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.fillText(label, node.x, node.y + radius + 5); // Adjust label position to be below the node
              }}
              onNodeClick={handleNodeClick}
            />
          </div>
        </div>
      </div>
    );
  }
