export interface FontConfig {
  family: string
  weights: string[]
  styles: string[]
  category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace'
}

export const FONT_REGISTRY: FontConfig[] = [
  {
    family: 'Inter',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    styles: ['normal'],
    category: 'sans-serif'
  },
  {
    family: 'Roboto',
    weights: ['100', '300', '400', '500', '700', '900'],
    styles: ['normal', 'italic'],
    category: 'sans-serif'
  },
  {
    family: 'Open Sans',
    weights: ['300', '400', '500', '600', '700', '800'],
    styles: ['normal', 'italic'],
    category: 'sans-serif'
  },
  {
    family: 'Playfair Display',
    weights: ['400', '500', '600', '700', '800', '900'],
    styles: ['normal', 'italic'],
    category: 'serif'
  },
  {
    family: 'Merriweather',
    weights: ['300', '400', '700', '900'],
    styles: ['normal', 'italic'],
    category: 'serif'
  },
  {
    family: 'Lora',
    weights: ['400', '500', '600', '700'],
    styles: ['normal', 'italic'],
    category: 'serif'
  },
  {
    family: 'Montserrat',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    styles: ['normal', 'italic'],
    category: 'sans-serif'
  },
  {
    family: 'Raleway',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    styles: ['normal', 'italic'],
    category: 'sans-serif'
  },
  {
    family: 'Bebas Neue',
    weights: ['400'],
    styles: ['normal'],
    category: 'display'
  },
  {
    family: 'Dancing Script',
    weights: ['400', '500', '600', '700'],
    styles: ['normal'],
    category: 'handwriting'
  },
  {
    family: 'Fira Code',
    weights: ['300', '400', '500', '600', '700'],
    styles: ['normal'],
    category: 'monospace'
  },
  {
    family: 'JetBrains Mono',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800'],
    styles: ['normal', 'italic'],
    category: 'monospace'
  }
]