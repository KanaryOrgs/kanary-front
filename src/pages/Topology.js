import React, { useEffect, useState, useRef } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { CDBBtn, CDBContainer, CDBBtnGrp } from 'cdbreact';
import "./Topology.css"
import Dropdown from './Dropdown';

export const Topology = () => {
  const [nodes, setNodes] = useState([]);
  // const [links, setLinks] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [selectedNamespace, setSelectedNamespace] = useState('default');
  const [selectedMetric, setSelectedMetric] = useState('cpu_capacity');  // This can be 'cpu_capacity' or 'ram_capacity'
  const fgRef = useRef(); // Ref for accessing the force graph instance

  useEffect(() => {
    // Example pod data as fetched from the backend
    const podData = [
      {
        "name": "nginx1",
        "namespace": "nginx",
        "images": [
          "nginx1"
        ],
        "ip": "10.244.171.98",
        "status": "Running",
        "labels": {
          "run": "nginx"
        },
        "cpu_capacity": 19,
        "ram_capacity": 33,
        "restarts": 0
      },
      {
        "name": "nginx2",
        "namespace": "nginx",
        "images": [
          "nginx"
        ],
        "ip": "10.244.171.23",
        "status": "Running",
        "labels": {
          "run": "nginx"
        },
        "cpu_capacity": 3,
        "ram_capacity": 12,
        "restarts": 0
      },
      {
        "name": "nginx3",
        "namespace": "nginx",
        "images": [
          "nginx"
        ],
        "ip": "10.244.171.19",
        "status": "Running",
        "labels": {
          "run": "nginx"
        },
        "cpu_capacity": 7,
        "ram_capacity": 15,
        "restarts": 0
      },
      {
        "name": "nginx",
        "namespace": "default",
        "images": [
          "nginx"
        ],
        "ip": "10.244.171.69",
        "status": "Running",
        "labels": {
          "run": "nginx"
        },
        "cpu_capacity": 8,
        "ram_capacity": 15,
        "restarts": 0
      },
      {
        "name": "pod",
        "namespace": "default",
        "images": [
          "gninx"
        ],
        "ip": "10.244.171.68",
        "status": "Pending",
        "labels": {
          "run": "pod"
        },
        "cpu_capacity": 8,
        "ram_capacity": 15,
        "restarts": 0
      },
      {
        "name": "calico-kube-controllers-7c968b5878-frgdz",
        "namespace": "kube-system",
        "images": [
          "docker.io/calico/kube-controllers:v3.26.4"
        ],
        "ip": "10.244.171.66",
        "status": "Running",
        "labels": {
          "k8s-app": "calico-kube-controllers",
          "pod-template-hash": "7c968b5878"
        },
        "cpu_capacity": 8,
        "ram_capacity": 15,
        "restarts": 0
      },
      {
        "name": "calico-node-cccq9",
        "namespace": "kube-system",
        "images": [
          "docker.io/calico/node:v3.26.4"
        ],
        "ip": "10.10.0.118",
        "status": "Running",
        "labels": {
          "controller-revision-hash": "7489b54556",
          "k8s-app": "calico-node",
          "pod-template-generation": "1"
        },
        "cpu_capacity": 8,
        "ram_capacity": 12,
        "restarts": 0
      },
      {
        "name": "calico-node-xnwt5",
        "namespace": "kube-system",
        "images": [
          "docker.io/calico/node:v3.26.4"
        ],
        "ip": "10.10.0.117",
        "status": "Running",
        "labels": {
          "controller-revision-hash": "7489b54556",
          "k8s-app": "calico-node",
          "pod-template-generation": "1"
        },
        "cpu_capacity": 8,
        "ram_capacity": 7,
        "restarts": 0
      },
      {
        "name": "coredns-76f75df574-tpdg5",
        "namespace": "kube-system",
        "images": [
          "registry.k8s.io/coredns/coredns:v1.11.1"
        ],
        "ip": "10.244.171.67",
        "status": "Running",
        "labels": {
          "k8s-app": "kube-dns",
          "pod-template-hash": "76f75df574"
        },
        "cpu_capacity": 2,
        "ram_capacity": 20,
        "restarts": 0
      },
      {
        "name": "coredns-76f75df574-x72z8",
        "namespace": "kube-system",
        "images": [
          "registry.k8s.io/coredns/coredns:v1.11.1"
        ],
        "ip": "10.244.171.65",
        "status": "Running",
        "labels": {
          "k8s-app": "kube-dns",
          "pod-template-hash": "76f75df574"
        },
        "cpu_capacity": 5,
        "ram_capacity": 35,
        "restarts": 0
      },
      {
        "name": "etcd-master",
        "namespace": "kube-system",
        "images": [
          "registry.k8s.io/etcd:3.5.12-0"
        ],
        "ip": "10.10.0.118",
        "status": "Running",
        "labels": {
          "component": "etcd",
          "tier": "control-plane"
        },
        "cpu_capacity": 2,
        "ram_capacity": 44,
        "restarts": 0
      },
      {
        "name": "kube-apiserver-master",
        "namespace": "kube-system",
        "images": [
          "registry.k8s.io/kube-apiserver:v1.29.4"
        ],
        "ip": "10.10.0.118",
        "status": "Running",
        "labels": {
          "component": "kube-apiserver",
          "tier": "control-plane"
        },
        "cpu_capacity": 8,
        "ram_capacity": 15,
        "restarts": 0
      },
      {
        "name": "kube-controller-manager-master",
        "namespace": "kube-system",
        "images": [
          "registry.k8s.io/kube-controller-manager:v1.29.4"
        ],
        "ip": "10.10.0.118",
        "status": "Running",
        "labels": {
          "component": "kube-controller-manager",
          "tier": "control-plane"
        },
        "cpu_capacity": 8,
        "ram_capacity": 15,
        "restarts": 1
      },
      {
        "name": "kube-proxy-ml8kc",
        "namespace": "kube-system",
        "images": [
          "registry.k8s.io/kube-proxy:v1.29.4"
        ],
        "ip": "10.10.0.117",
        "status": "Running",
        "labels": {
          "controller-revision-hash": "5fbd756bc7",
          "k8s-app": "kube-proxy",
          "pod-template-generation": "1"
        },
        "cpu_capacity": 8,
        "ram_capacity": 15,
        "restarts": 0
      },
      {
        "name": "kube-proxy-nrtqv",
        "namespace": "kube-system",
        "images": [
          "registry.k8s.io/kube-proxy:v1.29.4"
        ],
        "ip": "10.10.0.118",
        "status": "Running",
        "labels": {
          "controller-revision-hash": "5fbd756bc7",
          "k8s-app": "kube-proxy",
          "pod-template-generation": "1"
        },
        "cpu_capacity": 8,
        "ram_capacity": 15,
        "restarts": 0
      },
      {
        "name": "kube-scheduler-master",
        "namespace": "kube-system",
        "images": [
          "registry.k8s.io/kube-scheduler:v1.29.4"
        ],
        "ip": "10.10.0.118",
        "status": "Running",
        "labels": {
          "component": "kube-scheduler",
          "tier": "control-plane"
        },
        "cpu_capacity": 8,
        "ram_capacity": 15,
        "restarts": 1
      }
    ];

      const graphNodes = podData.map((pod,index) => {
        const angle = 2 * Math.PI * index / podData.length;
        const radius = 70; // Adjust radius to spread out the nodes
        return {
          id: pod.name,
          name: pod.name,
          ip : pod.ip,
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
          fy: -50 + radius * Math.sin(angle)
        };
      });

      // const graphLinks = [];
      // graphNodes.forEach((node, idx) => {
      //   graphNodes.forEach((otherNode, otherIdx) => {
      //     if (idx !== otherIdx && node.namespace === otherNode.namespace) {
      //       graphLinks.push({ source: node.id, target: otherNode.id });
      //     }
      //   });
      // });
  
      setNodes(graphNodes);
      
      setNamespaces([...new Set(podData.map(pod => pod.namespace))]);
 
      // setLinks(graphLinks);


      
    }, []);

    const handleNamespaceChange = (namespace) => {
      setSelectedNamespace(namespace);
    };


    const filteredNodes = nodes.filter(node => node.namespace === selectedNamespace);

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
        <div><Sidebar/></div>
        <div style={{flex: "1 1 auto", display: "flex", flexFlow: "column", height: "100vh", overflowY: "hidden"}}>
          <Navbar/>
          <div className="event-content">
            <div className="event-header">
              <div>
                <h2>Topology</h2>
                <p>Kubernetes Cluster Topology</p>
              </div>
              <div id="tooltip"></div>
              <div className='settings'>
                <CDBContainer>
                  <CDBBtnGrp>
                    <CDBBtn className={selectedMetric === 'cpu_capacity' ? 'active' : ''} onClick={() => setSelectedMetric('cpu_capacity')} style={{ marginRight: '10px' }}>CPU</CDBBtn>
                    <CDBBtn className={selectedMetric === 'ram_capacity' ? 'active' : ''} onClick={() => setSelectedMetric('ram_capacity')} style={{ marginRight: '10px' }}>Memory</CDBBtn>
                  </CDBBtnGrp>
                </CDBContainer>
                <div className='dropdown'>
                  <Dropdown
                    label={`Namespace: ${selectedNamespace || 'Select'}`}
                    items={namespaces}
                    onSelect={handleNamespaceChange}
                  />
                </div>
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
                ctx.fillStyle = 'rgba(220, 220, 220, 0.9)'; // Light grey for the "empty" part
                ctx.fill();
              
                // Clipping area for the fill
                if (node[selectedMetric]) {
                  ctx.save(); // Save the current context state
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, radius, 0, Math.PI * 2, true);
                  ctx.clip(); // Clip to the path
              
                  // Draw the filled part from the bottom
                  ctx.beginPath();
                  ctx.rect(node.x - radius, node.y + radius, radius * 2, -radius * 2 * (metricValue / 100));
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









  // <CDBBtnGrp>
  //                 <CDBDropDown>
  //                   <CDBDropDownToggle color="warning">Namespace<CDBIcon fas icon="caret-down"/></CDBDropDownToggle>
  //                   <CDBDropDownMenu dropdown>
  //                     <CDBDropDownItem header>Select Namespace</CDBDropDownItem>
  //                     {namespaces.map(ns => (
  //                       <CDBDropDownItem key={ns} onClick={() => handleNamespaceChange(ns)}>{ns}</CDBDropDownItem>
  //                     ))}
  //                     {/* <CDBDropDownItem onClick={() => handleNamespaceChange('')}>Show All</CDBDropDownItem> */}
  //                   </CDBDropDownMenu>
  //                 </CDBDropDown>
  //               </CDBBtnGrp>