export function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "")  // remove punctuation
    .replace(/\s{2,}/g, " ")                     // replace multiple spaces with one
    .trim();
    
}

