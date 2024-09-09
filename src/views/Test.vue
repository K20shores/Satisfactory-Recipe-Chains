<template>
  <v-container>
    <h1>Test</h1>
    <ThemeViewer />
  </v-container>
</template>

<script>
import RecipeGraph from '../components/RecipeGraph.vue'
import ThemeViewer from '../components/ThemeViewer.vue'

export default {
  components: {
    ThemeViewer
  },
  data() {
    return {
    }
  }
}
</script>
  
<style scoped>
</style>