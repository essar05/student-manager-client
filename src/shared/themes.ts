import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper'

export const LIGHT_THEME = {
  ...MD3LightTheme,
  roundness: 2,

  colors: {
    ...MD3LightTheme.colors,
    primary: 'rgb(138,104,210)',
    background: '#e8e8e8',
    secondary: '#d2d2d2',
    // onSurface: '#ffffff',
    // background: 'red',
    // surface: 'green',
    // text: '#ffffff',
    // backdrop: 'pink'
  },
}

export const DARK_THEME = {
  ...MD3DarkTheme,
  roundness: 2,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    background: 'rgb(26,26,30)',
    primary: 'rgb(86,130,211)',
    accent: '#f1c40f',
    surface: 'rgb(53,50,58)',
  },
}

export const positiveColor = '#3dab2c'
export const negativeColor = '#c93232'
