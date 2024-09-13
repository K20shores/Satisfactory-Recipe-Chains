<template>
  <v-container>
    <v-tabs v-model="tab" grow bg-color="secondaryContainer">
      <!-- <v-tab color="onSecondaryContainer">Tree</v-tab> -->
      <v-tab color="onSecondaryContainer">
        Network <v-icon icon="mdi-graph-outline" color="info" size="24"></v-icon>
      </v-tab>
      <!-- <v-tab color="onSecondaryContainer">
        Items <v-icon icon="mdi-package-variant-closed" color="info" size="24"></v-icon>
      </v-tab>
      <v-tab color="onSecondaryContainer">
        Resources <v-icon icon="mdi-cube-outline" color="info" size="24"></v-icon>
      </v-tab> -->
    </v-tabs>
  </v-container>
  <v-container>
    <v-window v-model="tab">
      <v-window-item value="Network">
        <v-container>
          <RecipeGraph />
        </v-container>
      </v-window-item>
      <!-- <v-window-item value="Items">
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            xl="2"
            v-for="item in items"
            :key="item.name"
          >
            <v-card color="surface">
              <v-card-title color="onSurface">{{ item.name }}</v-card-title>
              <v-card-text color="onSurface">{{
                item.description
              }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item value="Resources">
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            xl="2"
            v-for="resource in resources"
            :key="resource.name"
          >
            <v-card color="surface">
              <v-card-title color="onSurface">{{ resource.name }}</v-card-title>
              <v-card-text color="onSurface">{{
                resource.description
              }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item> -->
    </v-window>
  </v-container>
</template>

<script>
import RecipeGraph from '../components/RecipeGraph.vue'

export default {
  components: {
    RecipeGraph
  },
  data() {
    return {
      tab: "Network",
    };
  },
};
</script>

<style>
</style>
