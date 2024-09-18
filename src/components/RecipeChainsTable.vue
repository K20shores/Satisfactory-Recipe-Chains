<template>
  <v-data-table
    :items="items"
    :headers="headers"
    :group-by="groupBy"
  >
    <template v-slot:group="{ group, isExpanded, toggleExpand }">
      <tr @click="toggleExpand">
        <td colspan="14" class="group-header">
          <v-icon>{{
            isExpanded ? "mdi-chevron-down" : "mdi-chevron-right"
          }}</v-icon>
          {{ group }}
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script setup>
import { ref } from "vue";

const groupBy = [
  {
    key: "item",
    order: "asc",
  },
];

const headers = [
  { title: "Recipe Chain", key: "recipeChain" },
  { title: "Iron", key: "iron" },
  { title: "Limestone", key: "limestone" },
  { title: "Copper", key: "copper" },
  { title: "Coal", key: "coal" },
  { title: "Quartz", key: "quartz" },
  { title: "Caterium", key: "caterium" },
  { title: "Bauxite", key: "bauxite" },
  { title: "Oil", key: "oil" },
  { title: "Nitrogen", key: "nitrogen" },
  { title: "Sulfur", key: "sulfur" },
  { title: "Uranium", key: "uranium" },
  { title: "Sam", key: "sam" },
  { title: "Water", key: "water" },
];

const items = ref([
  {
    item: "Cable",
    recipeChain: "Standard Wire",
    iron: 10,
    limestone: 5,
    copper: 8,
    coal: 3,
    quartz: 2,
    caterium: 4,
    bauxite: 6,
    oil: 7,
    nitrogen: 9,
    sulfur: 1,
    uranium: 0,
    sam: 12,
    water: 15,
  },
  {
    item: "Cable",
    recipeChain: "Copper Wire",
    iron: 6,
    limestone: 3,
    copper: 5,
    coal: 2,
    quartz: 1,
    caterium: 2,
    bauxite: 4,
    oil: 3,
    nitrogen: 7,
    sulfur: 0,
    uranium: 1,
    sam: 8,
    water: 10,
  },
  {
    item: "Alumina Solution",
    recipeChain: "Standard",
    iron: 10,
    limestone: 5,
    copper: 8,
    coal: 3,
    quartz: 2,
    caterium: 4,
    bauxite: 6,
    oil: 7,
    nitrogen: 9,
    sulfur: 1,
    uranium: 0,
    sam: 12,
    water: 15,
  },
  {
    item: "Alumina Solution",
    recipeChain: "Sloppy Alumina",
    iron: 6,
    limestone: 3,
    copper: 5,
    coal: 2,
    quartz: 1,
    caterium: 2,
    bauxite: 4,
    oil: 3,
    nitrogen: 7,
    sulfur: 0,
    uranium: 1,
    sam: 8,
    water: 10,
  },
]);
</script>