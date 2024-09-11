<template>
  <v-container>
    <v-row>
      <!-- Column for the search input -->
      <v-col cols="3">
        <v-text-field
          v-model="search"
          label="Search Nodes"
          clearable
        ></v-text-field>
        <v-list class="node-list">
          <v-list-item
            v-for="(node, nodeId) in availableNodes"
            :key="nodeId"
            @click="addNodeToGraph(nodeId)"
          >
            <v-list-item-title>{{ node.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>
      <!-- Column for the graph and control panel -->
      <v-col cols="9">
        <!-- Container for the control panel -->
        <v-container class="control-panel">
          <v-row class="justify-space-between align-center">
            <!-- Hamburger menu with options -->
            <v-menu offset-y>
              <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props">
                  <v-icon>mdi-menu</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="copySvgToClipboardAsPng">
                  <v-icon left>mdi-content-copy</v-icon>
                  <v-list-item-title>Copy to Clipboard</v-list-item-title>
                </v-list-item>
                <v-list-item @click="saveToSVG">
                  <v-icon left>mdi-image</v-icon>
                  <v-list-item-title>Save SVG</v-list-item-title>
                </v-list-item>
                <v-list-item @click="exportGraphAsJson">
                  <v-icon left>mdi-download</v-icon>
                  <v-list-item-title>Download JSON</v-list-item-title>
                </v-list-item>
                <v-list-item @click="uploadGraph">
                  <v-icon left>mdi-upload</v-icon>
                  <v-list-item-title>Upload JSON</v-list-item-title>
                  <input type="file" @change="handleFileUpload" style="display: none" ref="fileInput">
                </v-list-item>
              </v-list>
            </v-menu>
            <v-btn
              @click="removeNode"
              :disabled="selectedNodes.length === 0"
              icon
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-btn @click="clearGraph" icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-checkbox
              v-model="d3ForceEnabled"
              label="Auto Layout"
              hide-details
              dense
            ></v-checkbox>
          </v-row>
          <!-- Row for the legend -->
          <v-row class="justify-space-between align-center">
            <span>
              Recipe
              <v-icon class="legend-circle recipe-legend"></v-icon>
            </span>
            <span>
              Item
              <v-icon class="legend-circle item-legend"></v-icon>
            </span>
          </v-row>
        </v-container>
        <!-- Network graph component -->
        <v-network-graph
          ref="graph"
          v-model:selected-nodes="selectedNodes"
          :nodes="displayedNodes"
          :edges="edges"
          :configs="configs"
        >
          <template #edge-label="{ edge, ...slotProps }">
            <v-edge-label
              :text="`${edge.amount}`"
              align="center"
              vertical-align="above"
              v-bind="slotProps"
            />
          </template>
          <!-- <template #edge-overlay="{ edge, scale, length, pointAtLength }">
            <g
              class="edge-icon"
              :transform="`translate(${pointAtLength(0).x}, ${
                pointAtLength(length).y
              })`"
            >
              <foreignObject
                :width="24 * scale"
                :height="24 * scale"
                x="-12"
                y="-12"
              >
                <svg
                  :width="24 * scale"
                  :height="24 * scale"
                  viewBox="0 0 24 24"
                >
                  <path :d="mdiLightningBolt" fill="gold" stroke="black" stroke-width="1" />
                </svg>
              </foreignObject>
            </g>
          </template> -->
        </v-network-graph>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from "vue";
import data from "../assets/data.json";
import * as vNG from "v-network-graph";
import { ForceLayout } from "v-network-graph/lib/force-layout";
import { mdiLightningBolt } from "@mdi/js";

const graph = ref(null);
const selectedNodes = ref([]);
const search = ref("");

const items = data.items;
const resources = data.resources;
const displayedNodes = ref({});
const edges = data.graph.edges;
const fileInput = ref(null);

const availableNodes = computed(() => {
  return Object.fromEntries(
    Object.entries(data.graph.nodes)
      .filter(([nodeId, node]) => {
        if (search.value) {
          return (
            !displayedNodes.value[nodeId] &&
            node.name.toLowerCase().includes(search.value.toLowerCase())
          );
        } else {
          return !displayedNodes.value[nodeId];
        }
      })
      .sort((a, b) => a[1].name.localeCompare(b[1].name))
  );
});

const addNodeToGraph = (nodeId) => {
  if (!displayedNodes.value[nodeId]) {
    displayedNodes.value[nodeId] = { ...data.graph.nodes[nodeId] };
  }
};

const removeNode = () => {
  selectedNodes.value.forEach((nodeId) => {
    if (displayedNodes.value[nodeId]) {
      const updatedNodes = { ...displayedNodes.value };
      delete updatedNodes[nodeId];
      displayedNodes.value = updatedNodes;
    }
  });
  selectedNodes.value = [];
};

const clearGraph = () => {
  displayedNodes.value = {};
  selectedNodes.value = [];
};

const loadNodesFromLocalStorage = () => {
  const savedNodes = localStorage.getItem("nodes");
  return savedNodes ? JSON.parse(savedNodes) : {};
};

const saveNodesToLocalStorage = (nodes) => {
  localStorage.setItem("nodes", JSON.stringify(nodes));
};

watch(
  displayedNodes,
  (newNodes) => {
    saveNodesToLocalStorage(newNodes);
  },
  { deep: true }
);

// Shared functionality to replace color variables in SVG
const replaceColorInSVG = (svgElement) => {
  const computedStyle = getComputedStyle(document.documentElement);

  const getColor = (colorVar) => {
    return `rgb(${computedStyle.getPropertyValue(colorVar).trim()})`;
  };

  svgElement.querySelectorAll("[fill], [stroke], [color]").forEach((el) => {
    const fill = el.getAttribute("fill");
    const stroke = el.getAttribute("stroke");
    const color = el.getAttribute("color");

    if (color && color.includes("var(--v-theme-")) {
      el.setAttribute("color", getColor(color.slice(8, -2)));
    }

    if (fill && fill.includes("var(--v-theme-")) {
      el.setAttribute("fill", getColor(fill.slice(8, -2)));
    }

    if (stroke && stroke.includes("var(--v-theme-")) {
      el.setAttribute("stroke", getColor(stroke.slice(8, -2)));
    }
  });
};

// Function to save SVG to file
const saveToSVG = async () => {
  if (!graph.value) return;

  // Get the SVG content as text
  let svgText = await graph.value.exportAsSvgText();

  // Parse the SVG text to manipulate it
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
  const svgElement = svgDoc.documentElement;

  // Replace color variables in the SVG
  replaceColorInSVG(svgElement);

  // Convert the updated SVG element back to text
  const serializer = new XMLSerializer();
  const serializedSvgText = serializer.serializeToString(svgElement);

  // Trigger download of the SVG
  const url = URL.createObjectURL(
    new Blob([serializedSvgText], { type: "image/svg+xml" })
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "network-graph.svg";
  a.click();
  window.URL.revokeObjectURL(url);
};

// Function to copy SVG as PNG to clipboard
const copySvgToClipboardAsPng = async () => {
  if (!graph.value) return;

  // Get the SVG content as text
  let svgText = await graph.value.exportAsSvgText();

  // Create a DOMParser to parse the SVG text
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
  const svgElement = svgDoc.documentElement;

  // Replace color variables in the SVG
  replaceColorInSVG(svgElement);

  // Create a Blob from the updated SVG text
  const svgBlob = new Blob(
    [new XMLSerializer().serializeToString(svgElement)],
    { type: "image/svg+xml;charset=utf-8" }
  );
  const svgUrl = URL.createObjectURL(svgBlob);

  // Create an off-screen canvas and draw the SVG onto it
  const img = new Image();
  img.src = svgUrl;

  img.onload = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");

    // Draw the SVG image onto the canvas
    ctx.drawImage(img, 0, 0);

    // Convert the canvas to a Blob (PNG format) and copy to clipboard
    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    }, "image/png");

    // Clean up
    URL.revokeObjectURL(svgUrl);
  };
};

const exportGraphAsJson = () => {
  const nodesJson = JSON.stringify(displayedNodes.value, null, 2);
  const blob = new Blob([nodesJson], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "graph-nodes.json";
  a.click();
  URL.revokeObjectURL(url);
};

const uploadGraph = () => {
  console.log("uploading graph");
  if (fileInput.value) fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    try {
      const nodes = JSON.parse(content);
      displayedNodes.value = nodes;
      selectedNodes.value = [];
    } catch (err) {
      alert("Invalid JSON file format. Please upload a valid file.");
    }
  };
  reader.readAsText(file);
  event.target.value = null;
};

onMounted(() => {
  const savedNodes = loadNodesFromLocalStorage();
  if (savedNodes) {
    displayedNodes.value = savedNodes;
  }
});

const d3ForceEnabled = computed({
  get: () => configs.view.layoutHandler instanceof ForceLayout,
  set: (value) => {
    if (value) {
      configs.view.layoutHandler = new ForceLayout();
    } else {
      configs.view.layoutHandler = new vNG.GridLayout({ grid: 10 });
    }
  },
});

const configs = reactive(
  vNG.defineConfigs({
    node: {
      selectable: true,
      normal: {
        type: "circle",
        color: (node) =>
          node.isRecipe
            ? "rgb(var(--v-theme-primary))"
            : "rgb(var(--v-theme-secondary-darken-1))",
      },
      label: {
        text: (node) => node.name,
        color: "rgb(var(--v-theme-on-background))",
      },
    },
    view: {
      grid: {
        visible: true,
        interval: 10,
        thickIncrements: 5,
        line: {
          color: "rgb(var(--v-theme-primary))",
          width: 1,
          dasharray: 1,
        },
        thick: {
          color: "rgb(var(--v-theme-secondary))",
          width: 1,
          dasharray: 0,
        },
      },
      layoutHandler: new ForceLayout(),
    },
    edge: {
      marker: {
        source: {
          type: "none",
          width: 4,
          height: 4,
          margin: -1,
          offset: 0,
          units: "strokeWidth",
          color: null,
        },
        target: {
          type: "arrow",
          width: 4,
          height: 4,
          margin: -1,
          offset: 0,
          units: "strokeWidth",
          color: null,
        },
      },
    },
  })
);
</script>

<style scoped>
.node-list {
  height: 600px;
  overflow-y: auto;
}
.graph {
  width: 800px;
  height: 600px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.legend-circle {
  border-radius: 50%;
  display: inline-block;
}

.recipe-legend {
  background-color: rgb(var(--v-theme-primary));
}

.item-legend {
  background-color: rgb(var(--v-theme-secondary-darken-1));
}
</style>
