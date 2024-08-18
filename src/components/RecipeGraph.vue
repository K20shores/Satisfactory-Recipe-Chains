<template>
  <v-container>
    <v-row>
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
      <v-col cols="9">
        <v-container class="demo-control-panel">
          <v-row class="justify-space-around align-center">
            <v-btn @click="removeNode" :disabled="selectedNodes.length === 0">
              <v-icon>mdi-minus</v-icon>
              Remove
            </v-btn>
            <v-btn @click="downloadGraph">
              <v-icon>mdi-download</v-icon>
              Download SVG
            </v-btn>
          </v-row>
        </v-container>
        <v-network-graph
          ref="graph"
          v-model:selected-nodes="selectedNodes"
          :nodes="nodes"
          :edges="edges"
          :configs="configs"
          :event-handlers="eventHandlers"
        ></v-network-graph>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import data from "../assets/data.json";
import * as vNG from "v-network-graph";

const graph = ref(null);
const selectedNodes = ref([]);
const search = ref("");

const items = data.items;
const resources = data.resources;
const nodes = reactive({});
const edges = reactive(data.graph.edges);
const filteredNodeList = reactive({ ...data.graph.nodes });

const configs = reactive(
  vNG.defineConfigs({
    node: {
      selectable: true,
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
      layoutHandler: new vNG.GridLayout({ grid: 10 }),
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
</style>
