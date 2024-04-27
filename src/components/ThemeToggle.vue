<template>
  <v-btn @click="toggleTheme">Toggle Theme</v-btn>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const theme = ref('light');

onMounted(() => {
  theme.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  updateTheme();
});

const updateTheme = () => {
  const themeCss = document.getElementById('theme-css');
  themeCss.href = `src/assets/css/theme.${theme.value}.css`;
};

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  updateTheme();
};
</script>