import { createTheme, MantineColorsTuple, DefaultMantineColor, Card } from '@mantine/core'

type ExtendedCustomColors = 'primary' | DefaultMantineColor

const primary: MantineColorsTuple = [
  '#ebefff',
  '#d5dafc',
  '#a9b1f1',
  '#7b87e9',
  '#5362e1',
  '#3a4bdd',
  '#2d3fdc',
  '#1f32c4',
  '#182cb0',
  '#0b259c',
]

export const theme = createTheme({
  colors: { primary },

  primaryColor: 'primary',
  components: {
    // Card: Card.extend({
    //   styles(themes, props, ctx) {
    //     return {
    //       root: {},
    //     }
    //   },
    // }),
  },
})

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>
  }
}
