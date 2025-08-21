import { v4 as uuidv4 } from "uuid";

export function generateRandomString(length: number): string {
    const uuid = uuidv4(); // Generate UUID
    // Remove hyphens and take the substring of desired length
    const randomString = uuid.replace(/-/g, '').substring(0, length);
    return randomString;
}

export function formatNumberInReadableForm(number: number) {
    // Convert number to string
    const numStr = number.toString();

    // Split the string into parts before and after the decimal point (if any)
    const parts = numStr.split('.');

    // Add commas to the part before the decimal point
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Join the parts back together with the decimal point (if any)
    return parts.join('.');
}

export function convertDateFormat(date: string | Date): string {
    // If the input is a string, parse it into a Date object
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    // Parse the input date string into a Date object

    // Get the year, month, and day from the Date object
    const year = dateObj.getFullYear().toString();
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // getMonth() is zero-based
    const day = ('0' + dateObj.getDate()).slice(-2);

    // Format the date into the desired string format
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

export function reformatDatetime(datetimeStr: string): string {
    // Parse the input datetime string
    const date = new Date(datetimeStr);

    // Extract the components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = '00'; // Fixed seconds as "00"

    // Format the datetime string into the desired format
    const formattedStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedStr;
}



export function capitalizeWords(input: string): string {
    return input
        .toLowerCase() // Ensure the entire string is lowercase first
        .split(' ') // Split the string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' '); // Join the words back together
}


export const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
};