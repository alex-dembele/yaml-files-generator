import { TranslationKeys } from "./types";

declare module 'react-i18next' {
    interface CustomTypeOptions {
        // Override the translation key type
        keySeparator: '.';
        nsSeparator: false;
        resources: {
            translation: Record<TranslationKeys, string>;
        };
    }
}