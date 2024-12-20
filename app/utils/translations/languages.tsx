import { locale } from "expo-localization";

const supportedLanguages = {
  // Key-value pairs
  // State the name of the language in its own language :)
  en: "English",
  fr: "Français",
  de: "Deutsche",
  ru: "Pусский",
  pt: "Português",
  es: "Español",
  it: "Italian"
};

const currentLanguage = Object.keys(supportedLanguages).includes(locale.substr(0, 2))
  ? locale.substr(0, 2)
  : supportedLanguages[0];

export { supportedLanguages, currentLanguage };
