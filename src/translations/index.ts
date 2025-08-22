import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { deepMerge } from "@/helpers/deep-merge-translation-object";
import { fr as layout_app_components_fr, en as layout_app_components_en } from "@/layouts/app/translation";


export const fr = {
    ...layout_app_components_fr,

    // Merge all module translations directly at the root level
    ...deepMerge(

    )
}

export const en = {
    ...layout_app_components_en,

    // Merge all module translations directly at the root level
    ...deepMerge(

    )
}

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
