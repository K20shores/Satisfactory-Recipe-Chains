<template>
  <v-container>
    <h1>Test</h1>
    <v-network-graph
      class="graph"
      :nodes="nodes"
      :edges="edges"
    />
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      nodes: {
        node1: { name: "Node 1" },
        node2: { name: "Node 2" },
        node3: { name: "Node 3" },
        node4: { name: "Node 4" },
      },
      edges: {
        edge1: { source: "node1", target: "node2" },
        edge2: { source: "node2", target: "node3" },
        edge3: { source: "node3", target: "node4" },
      }
    }
  }
}
</script>
  
<style scoped>
.graph {
  width: 800px;
  height: 600px;
  border: 1px solid #000;
}
</style>