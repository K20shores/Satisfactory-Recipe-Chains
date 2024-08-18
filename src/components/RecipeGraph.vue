<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-btn @click="downloadGraph">
          <v-icon>mdi-download</v-icon>
          Download SVG
        </v-btn>
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
          ref="graph"
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
import { reactive, ref, onMounted } from "vue";

export default {
  setup() {
    const graph = ref(null);

    const downloadGraph = async () => {
      console.log(graph.value)
      if (!graph.value) return
      const text = await graph.value.exportAsSvgText()
      const url = URL.createObjectURL(new Blob([text], { type: "octet/stream" }))
      const a = document.createElement("a")
      a.href = url
      a.download = "network-graph.svg"
      a.click()
      window.URL.revokeObjectURL(url)
    };

    return {
      graph,
      downloadGraph,
    };
  },
  data() {
    return {
      items: data.items,
      resources: data.resources,
      nodes: reactive({}),
      edges: data.graph.edges,
      search: "",
      filteredNodeList: reactive({ ...data.graph.nodes }),
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
      return Object.fromEntries(
        Object.entries(this.filteredNodeList)
          .filter(([nodeId, node]) => {
            if (this.search) {
              return (
                !this.nodes[nodeId] &&
                node.name.toLowerCase().includes(this.search.toLowerCase())
              );
            } else {
              return !this.nodes[nodeId];
            }
          })
          .sort((a, b) => a[1].name.localeCompare(b[1].name))
      );
    },
  },
  methods: {
    addNodeToGraph(nodeId) {
      if (this.filteredNodeList[nodeId]) {
        this.nodes[nodeId] = this.filteredNodeList[nodeId];
        delete this.filteredNodeList[nodeId];
      }
    },
  },
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
