<template>
  <v-footer color="secondary" style="max-height: 50px;">
    <v-container fluid text-xs-center>
      <v-row align="center">
        <v-col cols="6">
          <p color="onSecondary">© {{ currentYear }} James Hollas & Kyle Shores</p>
        </v-col>
        <v-col cols="6">
          <v-row justify="end" align="center">
            <v-col cols="auto">
              <p color="onSecondary" class="text-right">Version: {{ packageVersion }}</p>
            </v-col>
            <v-col cols="auto">
              <a href="https://github.com/K20shores/Satisfactory-Recipe-Chains" target="_blank">
                <v-icon color="onSecondary">mdi-github</v-icon>
              </a>
            </v-col>
          </v-row>
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