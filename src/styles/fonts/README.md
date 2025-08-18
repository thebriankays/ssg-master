# Font Files Directory

This directory is reserved for custom font files if needed. Currently, the project uses Google Fonts loaded via Next.js font optimization.

## Current Fonts

- **Inter** - Primary font for body text
- **Manrope** - Secondary font for headings  
- **JetBrains Mono** - Monospace font for code

## Adding Custom Fonts

To add custom font files:

1. Place your font files (.woff2, .woff, .ttf, etc.) in this directory
2. Update the font configuration in `/src/styles/fonts.ts`
3. Import and configure using Next.js `localFont` instead of Google Fonts

Example:
```typescript
import localFont from 'next/font/local'

export const customFont = localFont({
  src: './fonts/CustomFont.woff2',
  variable: '--font-custom',
  display: 'swap',
})
```