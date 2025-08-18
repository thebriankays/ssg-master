import { fontConfig, typeScale } from './fonts'

/**
 * Calculate fluid typography size
 * @param minSize - Minimum font size in rem
 * @param maxSize - Maximum font size in rem
 * @param minViewport - Minimum viewport width in px (default: 320)
 * @param maxViewport - Maximum viewport width in px (default: 1920)
 * @returns CSS clamp value for fluid typography
 */
export function fluidType(
  minSize: number,
  maxSize: number,
  minViewport = 320,
  maxViewport = 1920,
): string {
  const slope = (maxSize - minSize) / (maxViewport - minViewport)
  const yIntercept = minSize - slope * minViewport

  return `clamp(${minSize}rem, ${yIntercept}rem + ${slope * 100}vw, ${maxSize}rem)`
}

/**
 * Get type scale value by key
 * @param scale - The scale category (display, h1-h6, body, label, code)
 * @param size - The size variant (large, medium, small, base)
 * @returns Type scale configuration object
 */
export function getTypeScale(scale: keyof typeof typeScale, size?: string) {
  const scaleConfig = typeScale[scale]
  
  if (typeof scaleConfig === 'object' && size && size in scaleConfig) {
    return scaleConfig[size as keyof typeof scaleConfig]
  }
  
  return scaleConfig
}

/**
 * Convert px to rem
 * @param px - Pixel value
 * @param base - Base font size (default: 16)
 * @returns Rem value as string
 */
export function pxToRem(px: number, base = 16): string {
  return `${px / base}rem`
}

/**
 * Convert rem to px
 * @param rem - Rem value
 * @param base - Base font size (default: 16)
 * @returns Pixel value
 */
export function remToPx(rem: number, base = 16): number {
  return rem * base
}

/**
 * Get responsive font size configuration
 * @param baseSize - Base size key from fontConfig.sizes
 * @param scale - Scale factor for different breakpoints
 * @returns Object with responsive font sizes
 */
export function responsiveFontSize(
  baseSize: keyof typeof fontConfig.sizes,
  scale = { sm: 0.85, md: 0.9, lg: 1, xl: 1.1 },
) {
  const base = fontConfig.sizes[baseSize]
  const baseValue = parseFloat(base)

  return {
    base: base,
    sm: `${baseValue * scale.sm}rem`,
    md: `${baseValue * scale.md}rem`,
    lg: `${baseValue * scale.lg}rem`,
    xl: `${baseValue * scale.xl}rem`,
  }
}

/**
 * Generate CSS variables for typography
 * @returns Object with CSS variable declarations
 */
export function generateTypographyVars() {
  const vars: Record<string, string> = {}

  // Font families
  Object.entries(fontConfig.families).forEach(([key, value]) => {
    vars[`--font-${key}`] = value
  })

  // Font weights
  Object.entries(fontConfig.weights).forEach(([key, value]) => {
    vars[`--font-weight-${key}`] = value.toString()
  })

  // Font sizes
  Object.entries(fontConfig.sizes).forEach(([key, value]) => {
    vars[`--font-size-${key}`] = value
  })

  // Line heights
  Object.entries(fontConfig.lineHeights).forEach(([key, value]) => {
    vars[`--line-height-${key}`] = value.toString()
  })

  // Letter spacing
  Object.entries(fontConfig.letterSpacing).forEach(([key, value]) => {
    vars[`--letter-spacing-${key}`] = value
  })

  return vars
}

/**
 * Create a text style object for inline styles
 * @param options - Style options
 * @returns React CSSProperties object
 */
export function createTextStyle(options: {
  size?: keyof typeof fontConfig.sizes
  weight?: keyof typeof fontConfig.weights
  lineHeight?: keyof typeof fontConfig.lineHeights
  letterSpacing?: keyof typeof fontConfig.letterSpacing
  family?: keyof typeof fontConfig.families
}): React.CSSProperties {
  return {
    fontSize: options.size ? fontConfig.sizes[options.size] : undefined,
    fontWeight: options.weight ? fontConfig.weights[options.weight] : undefined,
    lineHeight: options.lineHeight ? fontConfig.lineHeights[options.lineHeight] : undefined,
    letterSpacing: options.letterSpacing ? fontConfig.letterSpacing[options.letterSpacing] : undefined,
    fontFamily: options.family ? fontConfig.families[options.family] : undefined,
  }
}