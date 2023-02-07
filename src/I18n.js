/*import { createI18n } from 'react-router-i18n';
import translationEN from "./locales/en.json";
import translationES from "./locales/es.json";

const locales = ['en', 'es'];


const translations = {
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  }
}

const I18n = createI18n(
  locales,
  translations,
);

export default I18n;*/

import i18n from "i18next";
import { initReactI18next } from "react-i18next";


// Importing translation files

import translationEN from "./locales/en.json";
import translationES from "./locales/es.json";


//Creating object with the variables of imported translation files
const resources = {
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
};

//i18N Initialization

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng:"en", //default language
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;