// Check for broken LaTeX patterns in rendered HTML
export const hasBrokenLatex = (renderedHtml: string): boolean => {
  // Pattern 1: LaTeX delimiters inside paragraph tags
  // Broken: <p>$$\begin{align*}...
  if (renderedHtml.includes('<p>$$')) {
    return true
  }

  // Pattern 2: Single backslash at line end in math blocks (should be \\)
  // This appears as " \" or " \<" in rendered HTML
  if (renderedHtml.includes('&amp;') && renderedHtml.includes('$$')) {
    // If we have both &amp; and $$, it's likely broken LaTeX
    // (HTML entities shouldn't appear in properly rendered math)
    return true
  }

  // Pattern 3: "$$ " (double dollar followed by space)
  if (renderedHtml.includes('$$ ')) {
    return true
  }

  // Pattern 4: "$$ \" - double dollar followed by backslash
  if (renderedHtml.includes('$$ \\')) {
    return true
  }

  return false
}
