<template>
  <v-container 
    style="max-width: 95%;"
  >
    <v-tabs v-model="tab" grow bg-color="secondaryContainer">
      <v-tab color="onSecondaryContainer">
        Network <v-icon icon="mdi-graph-outline" color="info" size="24"></v-icon>
      </v-tab>
      <v-tab color="onSecondaryContainer">
        Table <v-icon icon="mdi-table" color="info" size="24"></v-icon>
      </v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="Network">
        <RecipeGraph />
      </v-window-item>
      <v-window-item value="Items">
        <RecipeChainsTable />
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import RecipeGraph from '../components/RecipeGraph.vue';
import RecipeChainsTable from '../components/RecipeChainsTable.vue';

// Define reactive state
const tab = ref("Network");

// Components
const components = {
  RecipeGraph,
  RecipeChainsTable
};
</script>