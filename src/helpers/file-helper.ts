export function isExcelFIle(file: File): boolean {
    // Get the file extension
    const extension = file ? file.name.split('.').pop()?.toLowerCase() : "";
    
    // Check if the file extension corresponds to a excel file type
    if (
        extension === 'xls' ||
        extension === 'xlsx'
    ) return true;
    
    return false;
}