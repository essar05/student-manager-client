import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DefaultTheme, DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import useCachedResources from './src/hooks/useCachedResources';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation/navigation';
import React from 'react';

export const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1d83c4',
    accent: '#f1c40f'
    // onSurface: '#ffffff',
    // background: 'red',
    // surface: 'green',
    // text: '#ffffff',
    // backdrop: 'pink'
  }
};

const dark_theme = {
  ...DarkTheme,
  roundness: 2,
  colors: {
    ...DarkTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f'
  }
};

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <PaperProvider theme={colorScheme === 'dark' ? dark_theme : theme}>
          <Navigation colorScheme={colorScheme}/>
          <StatusBar/>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }
}
