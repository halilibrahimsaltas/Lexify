import { useFonts, Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';

export const useRobotoFonts = () => {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
  });

  return fontsLoaded;
}; 