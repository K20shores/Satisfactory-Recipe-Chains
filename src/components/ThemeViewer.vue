<template>
  <div>
    <v-app>
      <v-container>
        <v-card>
          <v-card-title>
            Vuetify Theme Viewer
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col v-for="(color, name) in themeColors" :key="name" cols="4">
                <v-card :style="{ backgroundColor: color }" dark>
                  <v-card-text>
                    {{ name }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-app>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
const themeColors = computed(() => theme.global.current.value.colors);
</script>

<style scoped>
</style>