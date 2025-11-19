/**
 * Generates initials from a given name string.
 *
 * @param name - The input name string
 * @returns A string containing the initials (max 2 characters)
 *
 * @example
 * ```ts
 * getInitials("John Doe") // "JD"
 * getInitials("John") // "J"
 * getInitials("John Michael Doe") // "JM"
 * getInitials("") // "UN"
 * getInitials("  ") // "UN"
 * getInitials("A") // "A"
 * ```
 */

export const getInitials = (name: string): string => {
  // Input validation and normalization
  if (typeof name !== 'string') {
    return 'UN'
  }

  const normalizedName = name.trim()

  if (normalizedName.length === 0) {
    return 'UN'
  }

  // Handle single character case
  if (normalizedName.length === 1) {
    return normalizedName.toUpperCase()
  }

  // Split by whitespace and filter out empty strings
  const words = normalizedName.split(/\s+/).filter((word) => word.length > 0)

  if (words.length === 0) {
    return 'UN'
  }

  // Take first character of up to first two words
  const initials = words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')

  return initials
}
