<template>
    <v-footer color="secondary" style="max-height: 50px;">
      <v-container fluid text-xs-center>
        <v-row align="center">
          <v-col cols="12">
            <p color="onSecondary">© {{ currentYear }} James Hollas</p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </template>
  
  <script>
  export default {
    name: 'Footer',
    data() {
      return {
        currentYear: new Date().getFullYear(),
      };
    },
  }
  </script>
  
  <style scoped>
  </style>