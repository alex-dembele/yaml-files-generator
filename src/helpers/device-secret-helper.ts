import { generateRandomString } from "./string-helper";

const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('myDatabase', 1);

        request.onerror = () => {
            reject(request.error);
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        request.onupgradeneeded = (event: any) => {
            const db: IDBDatabase = event.target.result;
            db.createObjectStore('secrets', { keyPath: 'key' });
        };
    });
}

const getDeviceSecret = async (): Promise<string> => {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['secrets'], 'readwrite');
        const objectStore = transaction.objectStore('secrets');
        const request = objectStore.get('deviceSecret');

        request.onsuccess = () => {
            if (request.result) {
                resolve(request.result.value);
            } else {
                const deviceSecret = generateRandomString(20);
                objectStore.add({ key: 'deviceSecret', value: deviceSecret });
                resolve(deviceSecret);
            }
        };

        request.onerror = () => {
            reject(request.error);
        };
    });

    // Usage
    // StorageDataService.getDeviceSecret()
    // .then((deviceSecret) => {
    //   console.log(deviceSecret);
    // })
    // .catch((error) => {
    //   console.error('Error:', error);
    // });
}

export default getDeviceSecret