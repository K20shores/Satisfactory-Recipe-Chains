import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import * as labsComponents from 'vuetify/labs/components'
// themes made from the builder: https://material-foundation.github.io/material-theme-builder/
import materialTheme from '../assets/material-theme.json'
import '@mdi/font/css/materialdesignicons.css'

const themes: Record<string, ThemeDefinition> = {}

for (const scheme in materialTheme.schemes) {
  const isDark = scheme.includes('dark');
  themes[scheme] = {
    dark: isDark,
    colors: materialTheme.schemes[scheme as keyof typeof materialTheme.schemes]
  }
}

export default createVuetify({
  components: {
    ...components,
    ...labsComponents,
  },
  directives,
  theme: {
    defaultTheme: 'light',
    themes
  },
})