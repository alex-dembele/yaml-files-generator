/* eslint-disable @typescript-eslint/no-explicit-any */
export function isObject<T>(item: T): item is T {
    return typeof item === 'object' && item !== null;
}

export function cloneDeep<T>(source: T): T {
    if (isObject<T>(source)) {
        if (Array.isArray(source)) {
            return source.map((element) => cloneDeep(element)) as T;
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const clonedObject = { ...source } as Record<string, any>;
            for (const key in clonedObject) {
                if (Object.prototype.hasOwnProperty.call(clonedObject, key)) {
                    clonedObject[key] = cloneDeep(clonedObject[key]);
                }
            }

            return clonedObject as T;
        }
    }

    return source;
}

type Merge<T extends { [key: string]: any }, S extends { [key: string]: any }> = T & S;

/**
 * Merge and deep copy the values of all the enumerable own properties of target object from source object to a new object
 * @param target The target object to get properties from.
 * @param source The source object from which to copy properties
 * @return A new merged and deep copied object
 */
function mergeDeep<T extends { [key: string]: any }, S extends {
    [key: string]: any
}>(target: T, source: S): Merge<T, S> {
    if (isObject(source) && Object.keys(source).length === 0) {
        return cloneDeep({ ...target, ...source }) as T & S;
    }

    const output: Merge<typeof target, typeof source> = { ...target, ...source };
    if (isObject(source) && isObject(target)) {
        Object.keys(source).forEach((key) => {
            if (isObject(source[key]) && key in target && isObject(target[key])) {
                (output as any)[key] = mergeDeep(target[key], source[key]);
            } else {
                (output as any)[key] = isObject(source[key]) ? cloneDeep(source[key]) : source[key]
            }
        });
    }
    return output;
}


export default mergeDeep