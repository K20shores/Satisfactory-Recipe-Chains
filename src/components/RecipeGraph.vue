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
            v-for="(node, nodeId) in filteredNodes"
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
            <v-btn @click="downloadGraph">
              <v-icon>mdi-download</v-icon>
              Download SVG
            </v-btn>
            <v-checkbox v-model="d3ForceEnabled" label="Auto Layout" />
          </v-row>
          <!-- Row for the legend -->
          <v-row class="justify-space-between align-center">
            <span>
              Recipe
              <v-icon class="legend-circle gray-circle"></v-icon>
            </span>
            <span>
              Item
              <v-icon class="legend-circle blue-circle"></v-icon>
            </span>
          </v-row>
        </v-container>
        <!-- Network graph component -->
        <v-network-graph
          ref="graph"
          v-model:selected-nodes="selectedNodes"
          :nodes="nodes"
          :edges="edges"
          :configs="configs"
          :event-handlers="eventHandlers"
        >
          <template #edge-label="{ edge, ...slotProps }">
            <v-edge-label
              :text="edge.amount"
              align="center"
              vertical-align="above"
              v-bind="slotProps"
            />
          </template>
        </v-network-graph>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import data from "../assets/data.json";
import * as vNG from "v-network-graph";
import { ForceLayout } from "v-network-graph/lib/force-layout";

// Existing variables and setup
const graph = ref(null);
const selectedNodes = ref([]);
const search = ref("");

const items = data.items;
const resources = data.resources;
const nodes = reactive({});
const edges = reactive(data.graph.edges);
const filteredNodeList = reactive({ ...data.graph.nodes });

// New computed property for managing the layout handler
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

// Configuration object with dynamic layout
const configs = reactive(
  vNG.defineConfigs({
    node: {
      selectable: true,
      normal: {
        type: "circle",
        color: (node) => node.color,
      },
    },
    view: {
      grid: {
        visible: true,
        interval: 10,
        thickIncrements: 5,
        line: {
          color: "#e0e0e0",
          width: 1,
          dasharray: 1,
        },
        thick: {
          color: "#cccccc",
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

const filteredNodes = computed(() => {
  return Object.fromEntries(
    Object.entries(filteredNodeList)
      .filter(([nodeId, node]) => {
        if (search.value) {
          return (
            !nodes[nodeId] &&
            node.name.toLowerCase().includes(search.value.toLowerCase())
          );
        } else {
          return !nodes[nodeId];
        }
      })
      .sort((a, b) => a[1].name.localeCompare(b[1].name))
  );
});

const addNodeToGraph = (nodeId) => {
  if (filteredNodeList[nodeId]) {
    nodes[nodeId] = filteredNodeList[nodeId];
    delete filteredNodeList[nodeId];
  }
};

const removeNode = () => {
  selectedNodes.value.forEach((nodeId) => {
    filteredNodeList[nodeId] = nodes[nodeId];
    delete nodes[nodeId];
  });
  selectedNodes.value = [];
};

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

const eventHandlers = {
  "node:click": ({ node }) => {},
};
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

.gray-circle {
  background-color: #7f7f7f;
}

.blue-circle {
  background-color: #1f77b4;
}
</style>
