import { useFonts, Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { LilyScriptOne_400Regular } from '@expo-google-fonts/lily-script-one';
import { Lobster_400Regular } from '@expo-google-fonts/lobster';

export const useRobotoFonts = () => {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    LilyScriptOne_400Regular,
    Lobster_400Regular,
  });

  return fontsLoaded;
}; 