<template>
  <v-app>
    <Menu />
    <v-container class="fill-height">
      <slot />
    </v-container>
    <Footer />
  </v-app>
</template>

<script setup lang="ts">
import Menu from './Menu.vue';
import Footer from './Footer.vue';
</script>