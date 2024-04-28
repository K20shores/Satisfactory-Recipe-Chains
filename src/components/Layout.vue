<template>
  <v-app>
    <Menu />
    <v-container class="fill-height">
      <router-view></router-view>
    </v-container>
    <Footer />
  </v-app>
</template>

<script setup lang="ts">
import Menu from './Menu.vue';
import Footer from './Footer.vue';
</script>