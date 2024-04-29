<template>
  <v-container>
    <v-tabs v-model="tab" grow bg-color="secondaryContainer">
      <v-tab color="onSecondaryContainer">Chains</v-tab>
      <v-tab color="onSecondaryContainer">Items</v-tab>
      <v-tab color="onSecondaryContainer">Resources</v-tab>
    </v-tabs>
  </v-container>
  <v-container>
    <v-window v-model="tab">
      <v-window-item value="Chains">
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
    </v-window>
  </v-container>
</template>

<script>
import data from '../assets/data.json';

const tree = [ { id: 1, title: 'Applications :', children: [ { id: 2, title: 'Calendar : app' }, { id: 3, title: 'Chrome : app' }, { id: 4, title: 'Webstorm : app' }, ], }, { id: 5, title: 'Documents :', children: [ { id: 6, title: 'vuetify :', children: [ { id: 7, title: 'src :', children: [ { id: 8, title: 'index : ts' }, { id: 9, title: 'bootstrap : ts' }, ], }, ], }, { id: 10, title: 'material2 :', children: [ { id: 11, title: 'src :', children: [ { id: 12, title: 'v-btn : ts' }, { id: 13, title: 'v-card : ts' }, { id: 14, title: 'v-window : ts' }, ], }, ], }, ], }, { id: 15, title: 'Downloads :', children: [ { id: 16, title: 'October : pdf' }, { id: 17, title: 'November : pdf' }, { id: 18, title: 'Tutorial : html' }, ], }, { id: 19, title: 'Videos :', children: [ { id: 20, title: 'Tutorials :', children: [ { id: 21, title: 'Basic layouts : mp4' }, { id: 22, title: 'Advanced techniques : mp4' }, { id: 23, title: 'All about app : dir' }, ], }, { id: 24, title: 'Intro : mov' }, { id: 25, title: 'Conference introduction : avi' }, ], }, ];

export default {
  data() {
    return {
      items: data.items,
      resources: data.resources,
      tab: null,
      tree: tree
    };
  },
};
</script>