import { useFonts as useExpoFonts } from 'expo-font';

export const useFonts = () => {
  const [fontsLoaded] = useExpoFonts({
    'Merriweather': require('../assets/fonts/Merriweather-VariableFont_opsz,wdth,wght.ttf'),
    'Merriweather-Italic': require('../assets/fonts/Merriweather-Italic-VariableFont_opsz,wdth,wght.ttf'),
  });

  return fontsLoaded;
}; 