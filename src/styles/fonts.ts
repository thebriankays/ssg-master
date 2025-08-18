import { Inter, Manrope, JetBrains_Mono } from 'next/font/google'

// Primary font - Inter for body text
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
})

// Secondary font - Manrope for headings
export const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  preload: true,
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
})

// Monospace font - JetBrains Mono for code
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  preload: true,
  fallback: ['Consolas', 'Monaco', 'Courier New', 'monospace'],
})

// Font configuration
export const fontConfig = {
  families: {
    sans: 'var(--font-inter)',
    heading: 'var(--font-manrope)',
    mono: 'var(--font-jetbrains-mono)',
  },
  weights: {
    thin: 100,
    extralight: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  sizes: {
    // Base sizes
    '2xs': '0.625rem', // 10px
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem', // 72px
    '8xl': '6rem', // 96px
    '9xl': '8rem', // 128px
  },
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
}

// Type scale configuration
export const typeScale = {
  // Display sizes
  display: {
    large: {
      fontSize: fontConfig.sizes['8xl'],
      lineHeight: fontConfig.lineHeights.none,
      letterSpacing: fontConfig.letterSpacing.tight,
      fontWeight: fontConfig.weights.bold,
    },
    medium: {
      fontSize: fontConfig.sizes['7xl'],
      lineHeight: fontConfig.lineHeights.none,
      letterSpacing: fontConfig.letterSpacing.tight,
      fontWeight: fontConfig.weights.bold,
    },
    small: {
      fontSize: fontConfig.sizes['6xl'],
      lineHeight: fontConfig.lineHeights.tight,
      letterSpacing: fontConfig.letterSpacing.tight,
      fontWeight: fontConfig.weights.bold,
    },
  },
  // Heading sizes
  h1: {
    fontSize: fontConfig.sizes['5xl'],
    lineHeight: fontConfig.lineHeights.tight,
    letterSpacing: fontConfig.letterSpacing.tight,
    fontWeight: fontConfig.weights.bold,
  },
  h2: {
    fontSize: fontConfig.sizes['4xl'],
    lineHeight: fontConfig.lineHeights.tight,
    letterSpacing: fontConfig.letterSpacing.tight,
    fontWeight: fontConfig.weights.semibold,
  },
  h3: {
    fontSize: fontConfig.sizes['3xl'],
    lineHeight: fontConfig.lineHeights.snug,
    letterSpacing: fontConfig.letterSpacing.normal,
    fontWeight: fontConfig.weights.semibold,
  },
  h4: {
    fontSize: fontConfig.sizes['2xl'],
    lineHeight: fontConfig.lineHeights.snug,
    letterSpacing: fontConfig.letterSpacing.normal,
    fontWeight: fontConfig.weights.medium,
  },
  h5: {
    fontSize: fontConfig.sizes.xl,
    lineHeight: fontConfig.lineHeights.normal,
    letterSpacing: fontConfig.letterSpacing.normal,
    fontWeight: fontConfig.weights.medium,
  },
  h6: {
    fontSize: fontConfig.sizes.lg,
    lineHeight: fontConfig.lineHeights.normal,
    letterSpacing: fontConfig.letterSpacing.normal,
    fontWeight: fontConfig.weights.medium,
  },
  // Body text sizes
  body: {
    large: {
      fontSize: fontConfig.sizes.lg,
      lineHeight: fontConfig.lineHeights.relaxed,
      letterSpacing: fontConfig.letterSpacing.normal,
      fontWeight: fontConfig.weights.regular,
    },
    base: {
      fontSize: fontConfig.sizes.base,
      lineHeight: fontConfig.lineHeights.normal,
      letterSpacing: fontConfig.letterSpacing.normal,
      fontWeight: fontConfig.weights.regular,
    },
    small: {
      fontSize: fontConfig.sizes.sm,
      lineHeight: fontConfig.lineHeights.normal,
      letterSpacing: fontConfig.letterSpacing.normal,
      fontWeight: fontConfig.weights.regular,
    },
  },
  // UI text sizes
  label: {
    large: {
      fontSize: fontConfig.sizes.sm,
      lineHeight: fontConfig.lineHeights.tight,
      letterSpacing: fontConfig.letterSpacing.wide,
      fontWeight: fontConfig.weights.medium,
    },
    base: {
      fontSize: fontConfig.sizes.xs,
      lineHeight: fontConfig.lineHeights.tight,
      letterSpacing: fontConfig.letterSpacing.wide,
      fontWeight: fontConfig.weights.medium,
    },
    small: {
      fontSize: fontConfig.sizes['2xs'],
      lineHeight: fontConfig.lineHeights.tight,
      letterSpacing: fontConfig.letterSpacing.wider,
      fontWeight: fontConfig.weights.medium,
    },
  },
  // Code text
  code: {
    large: {
      fontSize: fontConfig.sizes.base,
      lineHeight: fontConfig.lineHeights.relaxed,
      letterSpacing: fontConfig.letterSpacing.normal,
      fontWeight: fontConfig.weights.regular,
    },
    base: {
      fontSize: fontConfig.sizes.sm,
      lineHeight: fontConfig.lineHeights.normal,
      letterSpacing: fontConfig.letterSpacing.normal,
      fontWeight: fontConfig.weights.regular,
    },
    small: {
      fontSize: fontConfig.sizes.xs,
      lineHeight: fontConfig.lineHeights.normal,
      letterSpacing: fontConfig.letterSpacing.normal,
      fontWeight: fontConfig.weights.regular,
    },
  },
}

// Responsive breakpoints for typography
export const typographyBreakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// Fluid typography configuration
export const fluidTypography = {
  minViewport: 320,
  maxViewport: 1920,
  minFontScale: 0.8,
  maxFontScale: 1,
}

// Export font class names for Next.js
export const fontClassNames = `${inter.variable} ${manrope.variable} ${jetbrainsMono.variable}`