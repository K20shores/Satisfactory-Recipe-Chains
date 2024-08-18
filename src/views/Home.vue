<template>
  <v-container>
    <v-tabs v-model="tab" grow bg-color="secondaryContainer">
      <v-tab color="onSecondaryContainer">Tree</v-tab>
      <v-tab color="onSecondaryContainer">Items</v-tab>
      <v-tab color="onSecondaryContainer">Resources</v-tab>
      <v-tab color="onSecondaryContainer">Network</v-tab>
    </v-tabs>
  </v-container>
  <v-container>
    <v-window v-model="tab">
      <v-window-item value="Tree">
        <v-treeview :items="tree"></v-treeview>
      </v-window-item>
      <v-window-item value="Items">
        <v-row>
          <v-col cols="12" sm="6" md="4" lg="3" xl="2" v-for="item in items" :key="item.name">
            <v-card color="surface">
              <v-card-title color="onSurface">{{ item.name }}</v-card-title>
              <v-card-text color="onSurface">{{ item.description }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item value="Resources">
        <v-row>
          <v-col cols="12" sm="6" md="4" lg="3" xl="2" v-for="resource in resources" :key="resource.name">
            <v-card color="surface">
              <v-card-title color="onSurface">{{ resource.name }}</v-card-title>
              <v-card-text color="onSurface">{{ resource.description }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item value="Network">
        <v-network-graph
          class="graph"
          :nodes="nodes"
          :edges="edges"
          style="margin: 0 auto;"
        />
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script>
import data from '../assets/data.json';

export default {
  data() {
    return {
      tab: 'Tree',
      items: data.items,
      resources: data.resources,
      tree: data.tree,
      nodes: data.graph.nodes,
      edges: data.graph.edges,
    };
  },
};
</script>

<style>
.graph {
  width: 800px;
  height: 600px;
  /* border: 1px solid rgba(0, 0, 0, 0.5); */
  border-radius: 5%;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}
</style>