import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import materialTheme from '../assets/material-theme.json'

const themes: Record<string, ThemeDefinition> = {}

for (const scheme in materialTheme.schemes) {
  const isDark = scheme.includes('dark');
  themes[scheme] = {
    dark: isDark,
    colors: materialTheme.schemes[scheme]
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes
  },

})