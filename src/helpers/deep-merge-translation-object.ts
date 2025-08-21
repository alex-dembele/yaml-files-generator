// Type definitions for deep merge functionality
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DeepMergeObject = Record<string, any>;

// Utility type to check if a type is an object (not array or null)
type IsObject<T> = T extends object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? T extends any[]
    ? false
    : T extends null
    ? false
    : true
    : false;

// Deep merge two types
type DeepMerge<T, U> = {
    [K in keyof T | keyof U]: K extends keyof T
    ? K extends keyof U
    ? IsObject<T[K]> extends true
    ? IsObject<U[K]> extends true
    ? DeepMerge<T[K], U[K]>
    : U[K]
    : U[K]
    : T[K]
    : K extends keyof U
    ? U[K]
    : never;
};

// Recursive type for merging multiple objects
type DeepMergeAll<T extends readonly DeepMergeObject[]> = T extends readonly [
    infer First,
    ...infer Rest
]
    ? First extends DeepMergeObject
    ? Rest extends readonly DeepMergeObject[]
    ? Rest['length'] extends 0
    ? First
    : DeepMerge<First, DeepMergeAll<Rest>>
    : First
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    : {}
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    : {};

/**
 * Deep merge multiple objects into a single object with full TypeScript support
 * @param objects - Objects to merge (must be non-null objects)
 * @returns Deeply merged object with proper typing
 */
function deepMerge<T extends readonly DeepMergeObject[]>(
    ...objects: T
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
    // Filter out null/undefined objects with proper type guard
    const validObjects = objects.filter((obj): obj is NonNullable<DeepMergeObject> =>
        obj != null && typeof obj === 'object' && !Array.isArray(obj)
    );

    if (validObjects.length === 0) return {} as DeepMergeAll<T>;
    if (validObjects.length === 1) return { ...validObjects[0] } as DeepMergeAll<T>;

    return validObjects.reduce((merged, current) => {
        Object.keys(current).forEach((key: string) => {
            const currentValue = current[key];
            const mergedValue = merged[key];

            if (currentValue != null) {
                // Type guard to check if both values are mergeable objects
                const isCurrentObject = typeof currentValue === 'object' &&
                    !Array.isArray(currentValue) &&
                    currentValue !== null;

                const isMergedObject = typeof mergedValue === 'object' &&
                    !Array.isArray(mergedValue) &&
                    mergedValue !== null;

                if (isCurrentObject && isMergedObject) {
                    // Recursively merge objects
                    merged[key] = deepMerge(mergedValue, currentValue);
                } else {
                    // Otherwise, overwrite with the current value
                    merged[key] = currentValue;
                }
            }
        });
        return merged;
    }, {} as DeepMergeAll<T>);
}

// Example usage with full type safety:
// const obj1 = {
//   module: {
//     payment: {
//       account: {
//         balance: {
//           read: {
//             account_balance: 'Solde du compte',
//           },
//         },
//       },
//     },
//   },
//   config: {
//     theme: 'dark',
//   }
// } as const;

// const obj2 = {
//   module: {
//     payment: {
//       account: {
//         create: {
//           form: {
//             firstname_label: 'Prenom',
//             lastname_label: 'Nom',
//             email_label: 'Email',
//           },
//         },
//       },
//     },
//   },
//   config: {
//     language: 'fr',
//   }
// } as const;

// const obj3 = {
//   module: {
//     payment: {
//       account: {
//         list: {
//           datatable: {
//             account_name_header: 'NOM DU COMPTE',
//           },
//         },
//       },
//     },
//   },
//   global: {
//     common: {
//       save: 'Enregistrer',
//     },
//   }
// } as const;

// This will have full type inference and autocomplete
// const mergedResult = deepMerge(obj1, obj2, obj3);

// TypeScript will know the exact structure and provide autocomplete for:
// mergedResult.module.payment.account.balance.read.account_balance
// mergedResult.module.payment.account.create.form.firstname_label
// mergedResult.module.payment.account.list.datatable.account_name_header
// mergedResult.config.theme
// mergedResult.config.language
// mergedResult.global.common.save

// Alternative: More flexible version that accepts any object types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMergeFlexible<T extends DeepMergeObject[]>(...objects: T): any {
    const validObjects = objects.filter((obj): obj is NonNullable<DeepMergeObject> =>
        obj != null && typeof obj === 'object' && !Array.isArray(obj)
    );

    if (validObjects.length === 0) return {};
    if (validObjects.length === 1) return { ...validObjects[0] };

    return validObjects.reduce((merged, current) => {
        Object.keys(current).forEach((key: string) => {
            const currentValue = current[key];

            if (currentValue != null) {
                if (
                    typeof currentValue === 'object' &&
                    !Array.isArray(currentValue) &&
                    typeof merged[key] === 'object' &&
                    !Array.isArray(merged[key]) &&
                    merged[key] != null
                ) {
                    merged[key] = deepMergeFlexible(merged[key], currentValue);
                } else {
                    merged[key] = currentValue;
                }
            }
        });
        return merged;
    }, {});
}

export { deepMerge, deepMergeFlexible };
export type { DeepMerge, DeepMergeAll, DeepMergeObject };