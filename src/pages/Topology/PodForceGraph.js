// PodForceGraph.js
import React from "react";
import { ForceGraph2D } from "react-force-graph";

const PodForceGraph = ({ podDetails, selectedMetric, fgRef, onPodClick }) => {
  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={{ nodes: podDetails, links: [] }}
      nodeLabel="name"
      nodeCanvasObject={(node, ctx, globalScale) => {
        const label = node.name;
        const fontSize = 12 / globalScale;
        const radius = 10;
        const metricValue = node[selectedMetric];

        // Draw the outer circle (border)
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "rgba(220, 220, 220, 0.9)";
        ctx.fill();

        // Fill based on metric value
        if (metricValue) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, Math.PI * 2, true);
          ctx.clip();
          ctx.beginPath();
          ctx.rect(
            node.x - radius,
            node.y + radius,
            radius * 2,
            -radius * 2 * (metricValue / 300)
          );
          ctx.fillStyle = "rgba(0, 123, 255, 0.9)";
          ctx.fill();
          ctx.restore();
        }

        // Draw node label
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000";
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.fillText(label, node.x, node.y + radius + 5);
      }}
      onNodeClick={onPodClick}
    />
  );
};

export default PodForceGraph;
