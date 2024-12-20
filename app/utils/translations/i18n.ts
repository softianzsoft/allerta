import i18n from "i18n-js";

import { en, fr, es, de, ru, pt, it, TranslationKeys } from "./resources";
import { getSettings } from "webservice/DB";
import { locale as localeExpo } from "expo-localization";
import { includes } from "ramda";

const supportedLanguages: string[] = ["en", "fr", "es", "de", "ru", "pt", "it"];
const defaultLanguage = "en";

let lang = localeExpo.substring(0, 2);

if (!includes(lang, supportedLanguages)) {
  lang = defaultLanguage;
}

// Configure
i18n.fallbacks = true;
i18n.translations = { en, fr, es, de, ru, pt, it };

// Test locales quickly by overriding this value
i18n.locale = lang.substr(0, 2);

/*
 * Pass a translation key and receive a translated string, optionally passing a template value.
 * eg.
 * t('act') // Act
 * t('monthlyEmissionNumber', { co2: '100kg' }) // Your emissions this month 100kg
 **/
export function t(key: keyof TranslationKeys, values?: { [id: string]: string }): string {
  return values ? i18n.t(key, values) : i18n.t(key);
}

const getLanguage = async () => {
  try {
    const userLang = await getSettings("lang", "it");
    i18n.locale = userLang.substr(0, 2);
  } catch (error) {
    console.log(error);
  }
};

getLanguage();