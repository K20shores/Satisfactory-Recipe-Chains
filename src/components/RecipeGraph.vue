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
        <v-network-graph
          :nodes="nodes"
          :edges="edges"
          :configs="configs"
        ></v-network-graph>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import data from "../assets/data.json";
import * as vNG from "v-network-graph";
import { reactive } from "vue";

export default {
  data() {
    return {
      items: data.items,
      resources: data.resources,
      nodes: reactive({}),
      edges: data.graph.edges,
      availableNodes: reactive({ ...data.graph.nodes }),
      search: "",
      configs: reactive(
        vNG.defineConfigs({
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
        })
      ),
    };
  },
  computed: {
    filteredNodes() {
      const searchLower = this.search.toLowerCase();
      return Object.fromEntries(
        Object.entries(this.availableNodes).filter(([key, node]) =>
          node.name.toLowerCase().includes(searchLower)
        )
      );
    },
  },
  methods: {
    addNodeToGraph(nodeId) {
      if (this.availableNodes[nodeId]) {
        this.nodes[nodeId] = this.availableNodes[nodeId];
        delete this.availableNodes[nodeId];
      }
    },
  },
};
</script>

<style scoped>
.node-list {
  max-height: 400px;
  overflow-y: auto;
}
.graph {
  width: 800px;
  height: 600px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}
</style>
