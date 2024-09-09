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
          <!-- Row for the remove, download buttons, and layout checkbox -->
          <v-row class="justify-space-around align-center">
            <v-btn @click="removeNode" :disabled="selectedNodes.length === 0">
              <v-icon>mdi-minus</v-icon>
              Remove
            </v-btn>
            <v-btn @click="clearGraph">
              <v-icon>mdi-delete</v-icon>
              Clear
            </v-btn>
            <v-btn @click="downloadGraph" color="primary">
              <v-icon>mdi-download</v-icon>
              Download SVG
            </v-btn>
            <v-checkbox
              v-model="d3ForceEnabled"
              label="Auto Layout"
              hide-details
            />
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

const availableNodes = computed(() => {
  return Object.fromEntries(
    Object.entries(data.graph.nodes)
      .filter(([nodeId, node]) => {
        if (search.value) {
          return !displayedNodes.value[nodeId] && node.name.toLowerCase().includes(search.value.toLowerCase());
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

watch(displayedNodes, (newNodes) => {
  saveNodesToLocalStorage(newNodes);
}, { deep: true });


const downloadGraph = async () => {
  if (!graph.value) return;
  const text = await graph.value.exportAsSvgText();
  const url = URL.createObjectURL(new Blob([text], { type: "octet/stream" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "network-graph.svg";
  a.click();
  window.URL.revokeObjectURL(url);
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
        color: (node) => node.isRecipe ? "rgb(var(--v-theme-primary))" : "rgb(var(--v-theme-secondary-darken-1))",
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