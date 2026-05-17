/**
 * Formats a size given in kilobytes (KB) into a human-readable string (KB, MB, GB).
 * 
 * GitHub API returns repository sizes in KB.
 * 
 * @param kilobytes The size in kilobytes
 * @returns A formatted string like "30.0 KB" or "1.5 MB"
 */
export function formatSizeFromKB(kilobytes: number): string {
    if (kilobytes === 0) return "0 KB";

    const k = 1024;
    const sizes = ["KB", "MB", "GB", "TB"];
    
    // We start at index 0 which is KB because the input is already in KB
    const i = Math.floor(Math.log(kilobytes) / Math.log(k));
    
    // If it's less than 1MB, just return KB without decimals if it's small,
    // or with 1 decimal place.
    const formattedValue = parseFloat((kilobytes / Math.pow(k, i)).toFixed(1));
    
    // Fallback if index goes out of bounds (extremely large repo)
    const validIndex = Math.min(i, sizes.length - 1);

    return `${formattedValue} ${sizes[validIndex]}`;
}

/**
 * Formats a large number into a compact format (e.g., 1500 -> 1.5k).
 * 
 * @param num The number to format
 * @returns Compact string representation
 */
export function formatCompactNumber(num: number): string {
    return Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(num);
}
