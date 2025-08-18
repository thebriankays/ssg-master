'use client'

export interface SplitTextResult {
  chars: HTMLElement[]
  words: HTMLElement[]
  lines: HTMLElement[]
  revert: () => void
}

/**
 * Simple SplitText implementation that doesn't require GSAP's paid plugin
 */
export function splitText(
  element: HTMLElement,
  options: {
    type?: string
    linesClass?: string
    wordsClass?: string
    charsClass?: string
  } = {}
): SplitTextResult {
  const {
    type = 'words',
    linesClass = 'split-text__line',
    wordsClass = 'split-text__word',
    charsClass = 'split-text__char',
  } = options

  const originalHTML = element.innerHTML
  const originalDisplay = element.style.display
  
  const chars: HTMLElement[] = []
  const words: HTMLElement[] = []
  const lines: HTMLElement[] = []

  // Split into words
  const text = element.textContent || ''
  const wordStrings = text.split(/\s+/).filter(Boolean)
  
  element.innerHTML = ''
  
  wordStrings.forEach((wordText, wordIndex) => {
    const wordSpan = document.createElement('span')
    wordSpan.className = wordsClass
    wordSpan.style.display = 'inline-block'
    
    // Split word into chars if needed
    if (type.includes('chars')) {
      wordText.split('').forEach((char) => {
        const charSpan = document.createElement('span')
        charSpan.className = charsClass
        charSpan.textContent = char
        charSpan.style.display = 'inline-block'
        wordSpan.appendChild(charSpan)
        chars.push(charSpan)
      })
    } else {
      wordSpan.textContent = wordText
    }
    
    words.push(wordSpan)
    element.appendChild(wordSpan)
    
    // Add space after word (except last)
    if (wordIndex < wordStrings.length - 1) {
      element.appendChild(document.createTextNode(' '))
    }
  })

  // Revert function
  const revert = () => {
    element.innerHTML = originalHTML
    element.style.display = originalDisplay
  }

  return { chars, words, lines, revert }
}