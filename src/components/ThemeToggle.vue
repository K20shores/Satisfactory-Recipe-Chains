<template>
  <v-select
    :items="themeNames"
    v-model="selectedTheme"
    @update:modelValue="toggleTheme"
    label="Select a theme"
    class="theme-select"
    variant="underlined"
    hide-details
  ></v-select>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const darkMode = ref(false);
const selectedTheme = ref(localStorage.getItem('selectedTheme') || theme.global.name.value);
const themeNames = ref(Object.keys(theme.themes.value).sort());

const toggleTheme = () => {
  theme.global.name.value = selectedTheme.value;
  localStorage.setItem('selectedTheme', selectedTheme.value);
};

onMounted(() => {
  if (localStorage.getItem('selectedTheme')) {
    theme.global.name.value = localStorage.getItem('selectedTheme');
  }
});
</script>

<style scoped>
.theme-select {
  min-width: 150px;
  max-width: 200px;
}
</style>