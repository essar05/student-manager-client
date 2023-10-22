import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper'

export const LIGHT_THEME = {
  ...MD3LightTheme,
  roundness: 2,

  colors: {
    ...MD3LightTheme.colors,
    primary: '#2f98c5',

    // primary: '#23B7E5',
    background: '#e8e8e8',
    secondary: '#d2d2d2',
  },
}

export const DARK_THEME = {
  ...MD3DarkTheme,
  roundness: 2,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    background: '#112226',
    primary: '#2f98c5',
    accent: '#f1c40f',
    surface: '#2f98c5',
  },
}

export const positiveColor = '#3dab2c'
export const negativeColor = '#c93232'
