// Utility functions for use across the backend.

/**
 * Formats a Date object into 'YYYY-MM-DD' format.
 * @param date The Date object to format.
 * @returns A formatted date string.
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * A simple delay function for simulating network latency.
 * @param ms Milliseconds to wait.
 */
export const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

console.log("Backend helpers module loaded.");
