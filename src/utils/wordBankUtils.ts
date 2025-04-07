import { WordBankEntry } from "../types/WordBank";

/**
 * Fetches word bank entries by category.
 * @param category - The category to filter word bank entries by.
 * @returns A promise that resolves to an array of WordBankEntry objects.
 */
export const fetchWordBankByCategory = async (category: string): Promise<WordBankEntry[]> => {
  try {
    const response = await fetch(`/api/wordbank?category=${category}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch word bank data: ${response.statusText}`);
    }
    const data: WordBankEntry[] = await response.json();
    return data.filter((entry) => entry.categories?.includes(category)); // Check if the category exists in the categories array
  } catch (error) {
    console.error("Error fetching word bank data:", error);
    throw error;
  }
};
