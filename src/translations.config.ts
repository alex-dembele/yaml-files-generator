import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en, fr } from "./translations/locals";
// import store from "./redux.config";


// const getInitialLanguage = () => {
//     const state = store.getState();
//     console.log('Current language state:', state?.lang?.currentLanguage);
//     return state?.lang?.currentLanguage?.key || 'fr';
// };

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: en,
        },
        fr: {
            translation: fr
        }
    },
    lng: 'fr', // default language
    // fallbackLng: "fr",

    interpolation: {
        escapeValue: false, // React already safes from xss
    },
});

export default i18n;
