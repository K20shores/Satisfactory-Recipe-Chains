<template>
  <v-select
    :items="themeNames"
    v-model="selectedTheme"
    @update:modelValue="toggleTheme"
    label="Select a theme"
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
  console.log(selectedTheme.value);
  theme.global.name.value = selectedTheme.value;
};
</script>