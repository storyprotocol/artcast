// @ts-nocheck
// NodeGraph.js

import React, { useEffect } from "react";
import * as echarts from "echarts";
import { useRouter } from "next/navigation";

const NodeGraph = ({ nodes, currentId }) => {
  const router = useRouter();
  useEffect(() => {
    function buildGraphData(nodes) {
      const graphData = {
        nodes: [],
        links: [],
        categories: ["Root", "Current", "Other"],
      };

      nodes.forEach((node) => {
        graphData.nodes.push({
          id: node.id.toString(),
          name: `Artcast #${node.id}`,
          value: node.prompt_input,
          category: node.id == currentId ? 1 : !node.parent_id ? 0 : 2,
        });

        if (node.parent_id) {
          graphData.links.push({
            source: node.parent_id.toString(),
            target: node.id.toString(),
          });
        }
      });

      return graphData;
    }

    const chart = echarts.init(document.getElementById("your-chart-container"));

    const graphData = buildGraphData(nodes);

    const option = {
      darkMode: "auto",
      colorBy: "series",
      title: {
        text: "Cast Tree",
        subtext: "View all of the Artcasts in the same tree.",
      },
      legend: [
        {
          // selectedMode: 'single',
          data: graphData.categories,
          bottom: 0,
        },
      ],
      series: [
        {
          type: "graph",
          layout: "force",
          animation: false,
          draggable: true,
          data: graphData.nodes,
          edges: graphData.links,
          categories: [
            { name: "Root" },
            { name: "Current" },
            { name: "Other" },
          ],
          roam: true,
          label: {
            show: false,
            position: "right",
            formatter: "{b}",
          },
          edgeLabel: {
            show: false,
            formatter: "{c}",
          },
          force: {
            repulsion: 100,
          },
        },
      ],
      tooltip: {
        // Show the tooltip when hovering over a node
        show: true,
        formatter: (params) => {
          if (params.dataType == "edge") return "";
          // Extract the node ID and any other relevant data
          const nodePrompt = params.data.value;
          const nodeName = params.data.name;
          // Add more data properties as needed

          // Format the tooltip content
          return `${nodeName}<br />Prompt: "${nodePrompt}"`;
        },
      },
    };

    chart.setOption(option);
    chart.on("click", function (params) {
      if (params.data.id) {
        router.push(`/cast/${params.data.id}`);
      }
    });

    return () => {
      // Cleanup when the component unmounts
      chart.dispose();
    };
  }, [nodes]);

  return (
    <div id="your-chart-container" style={{ width: "100%", height: "400px" }} />
  );
};

export default NodeGraph;
