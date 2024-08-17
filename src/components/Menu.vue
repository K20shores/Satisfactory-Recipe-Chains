<template>
  <v-app-bar app color="primary" :absolute="false">
    <v-app-bar-nav-icon @click="open = !open" v-if="mobile"></v-app-bar-nav-icon>

    <v-app-bar-title class="text-start">Recipe Chains</v-app-bar-title>

    <v-spacer></v-spacer>
    <ThemeToggle/>
    <v-toolbar-items v-if="!mobile">
      <v-btn v-for="item in items" :key="item.title" @click="navigate(item.route)">
        <v-icon>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-btn>
    </v-toolbar-items>
  </v-app-bar>

  <v-navigation-drawer v-if="mobile" v-model="open" >
    <v-list>
      <v-list-item v-for="item in items" :key="item.title" @click="navigate(item.route)">
        <v-icon>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useDisplay } from 'vuetify';
import { useRoute, useRouter } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue';

export default {
  components: {
    ThemeToggle,
  },
  setup() {
    const { mobile } = useDisplay();
    const open = ref(false);
    const router = useRouter()
    const route = useRoute()
    const items = ref([
      { title: 'Home', icon: 'mdi-home', route: '/' },
      { title: 'About', icon: 'mdi-information', route: '/about' },
      { title: 'Test', icon: 'mdi-wrench', route: '/test' },
    ]);

    const navigate = (route) => {
      router.push(route);
      open.value = false;
    };

    onMounted(() => {
    });

    return {
      items,
      open,
      mobile,
      navigate,
    };
  },
};
</script>