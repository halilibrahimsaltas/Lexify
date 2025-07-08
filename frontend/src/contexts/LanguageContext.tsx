import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import en from "../locales/en.json";
import tr from "../locales/tr.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Language = "en" | "tr";

interface Translations {
  [key: string]: string;
}

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Translations> = {
  en,
  tr,
};

const LanguageContext = createContext<LanguageContextProps>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    (async () => {
      const storedLang = await AsyncStorage.getItem("appLanguage");
      if (storedLang === "en" || storedLang === "tr") {
        setLanguageState(storedLang);
      }
    })();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem("appLanguage", lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

// Context dışı kullanım için: AsyncStorage'dan dili okuyan yardımcı fonksiyon
export const getStoredLanguage = async (): Promise<Language> => {
  const storedLang = await AsyncStorage.getItem("appLanguage");
  if (storedLang === "en" || storedLang === "tr") {
    return storedLang;
  }
  return "en";
};
