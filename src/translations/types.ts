
import { en } from './index'; // Your translation files

// Advanced type to extract all possible key paths
// type Paths<T, D extends number = 10> = [D] extends [never]
//     ? never
//     : T extends object
//     ? {
//         [K in keyof T]-?: K extends string
//         ? T[K] extends object
//         ? `${K}` | `${K}.${Paths<T[K], Prev[D]>}`
//         : `${K}`
//         : never
//     }[keyof T]
//     : never;

// type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...0[]];

// // Generate all possible translation keys
// export type TranslationKeys = Paths<typeof en>;

type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<typeof en>;