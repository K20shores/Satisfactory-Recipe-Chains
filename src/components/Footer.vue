<template>
  <v-footer color="secondary" style="max-height: 50px;">
    <v-container fluid text-xs-center>
      <v-row align="center">
        <v-col cols="6">
          <p color="onSecondary">© {{ currentYear }} James Hollas & Kyle Shores</p>
        </v-col>
        <v-col cols="6">
          <p color="onSecondary" class="text-right">Version: {{ packageVersion }}</p>
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
      packageVersion: import.meta.env.PACKAGE_VERSION,
    };
  },
};
</script>

<style scoped>
</style>