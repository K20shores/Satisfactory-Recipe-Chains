<template>
  <v-app>
    <Menu />
    <v-main>
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Menu from './Menu.vue';
import Footer from './Footer.vue';
export default {
  components: {
    Menu,
    Footer,
  },
};
</script>