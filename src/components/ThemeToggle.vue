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
import { ref } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const darkMode = ref(false);
const selectedTheme = ref(theme.global.name.value);
const themeNames = ref(Object.keys(theme.themes.value).sort());

const toggleTheme = () => {
  theme.global.name.value = selectedTheme.value;
};
</script>

<style scoped>
.theme-select {
  min-width: 150px;
  max-width: 200px;
}
</style>