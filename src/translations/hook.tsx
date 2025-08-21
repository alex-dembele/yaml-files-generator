// import { useTranslation as useI18nTranslation } from 'react-i18next';
// import { TranslationKey } from './types';

// hooks/useTypedTranslation.ts
// export function useTypedTranslation() {
//     const { t: originalT, ...rest } = useI18nTranslation();

//     // Typed wrapper function
//     const t = <K extends TranslationKey>(
//         key: K,
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         options?: any // For interpolation, context, etc.
//     ): ReturnType<typeof originalT> => {
//         return originalT(key, options);
//     };

//     return {
//         t,
//         ...rest, // Returns i18n, ready, etc.
//     };
// }

// Alternative: You can also extend the existing hook
// export function useTranslation() {
//   const { t: originalT, ...rest } = useI18nTranslation();

//   const t = <K extends TranslationKeys>(
//     key: K,
//     options?: any
//   ): string => {
//     return originalT(key, options);
//   };

//   return {
//     t,
//     ...rest,
//   };
// }
