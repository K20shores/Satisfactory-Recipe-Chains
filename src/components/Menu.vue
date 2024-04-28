<template>
  <v-app>
    <v-app-bar :elevation="2">
      <v-app-bar-nav-icon @click="open = !open" v-if="mobile"></v-app-bar-nav-icon>

      <v-app-bar-title>Application Bar</v-app-bar-title>

      <v-spacer></v-spacer>
      <v-toolbar-items v-if="!mobile">
        <v-btn v-for="item in items" :key="item.title">
          <v-icon>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <!-- Move the v-navigation-drawer component here -->
    <v-navigation-drawer v-model="open" app>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title">
          <v-icon>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useDisplay } from 'vuetify';

export default {
  setup() {
    const { mobile } = useDisplay();
    const open = ref(false);
    const items = ref([
      { title: 'Home', icon: 'mdi-home' },
      { title: 'About', icon: 'mdi-information' },
      // Add more items here
    ]);

    onMounted(() => {
    });

    return {
      items,
      open,
      mobile,
    };
  },
};
</script>