// src/fields/FontSelector/FontSelector.ts
import type { Field } from 'payload'

// Static font options for type generation - this avoids dependency issues during build
const FONT_OPTIONS = [
  // Local Fonts
  { label: 'New Order (sans-serif)', value: 'new-order' },
  { label: 'Graphie (sans-serif)', value: 'graphie' },
  { label: 'Circular Std (sans-serif)', value: 'circular-std' },
  { label: 'Pangram Sans (sans-serif)', value: 'pangram-sans' },
  { label: 'Monument Extended (display)', value: 'monument-extended' },
  { label: 'Antique Olive (sans-serif)', value: 'antique-olive' },
  { label: 'Oakes Grotesk (sans-serif)', value: 'oakes-grotesk' },
  { label: 'PP Neue Corp (display)', value: 'pp-neue-corp' },
  { label: 'FK Grotesk Neue (sans-serif)', value: 'fk-grotesk-neue' },
  { label: 'Six Caps (display)', value: 'six-caps' },
  { label: 'Matter (sans-serif)', value: 'matter' },
  { label: 'Silka (sans-serif)', value: 'silka' },
  { label: 'Mrs Saint Delafield (handwriting)', value: 'mrs-saint-delafield' },
  { label: 'Parisienne (handwriting)', value: 'parisienne' },
  { label: 'Alien Robot (display)', value: 'alien-robot' },
  
  // Google Fonts
  { label: 'Inter (sans-serif)', value: 'inter' },
  { label: 'Roboto (sans-serif)', value: 'roboto' },
  { label: 'Open Sans (sans-serif)', value: 'open-sans' },
  { label: 'Montserrat (sans-serif)', value: 'montserrat' },
  { label: 'Lato (sans-serif)', value: 'lato' },
  { label: 'Raleway (sans-serif)', value: 'raleway' },
  { label: 'Oswald (display)', value: 'oswald' },
  { label: 'Saira Extra Condensed (display)', value: 'saira-extra-condensed' },
  { label: 'Playfair Display (serif)', value: 'playfair-display' },
  { label: 'Merriweather (serif)', value: 'merriweather' },
  { label: 'Libre Baskerville (serif)', value: 'libre-baskerville' },
]

export const fontSelectorField = (overrides: Partial<Field> = {}): Field => ({
  name: 'font',
  type: 'select',
  label: 'Font',
  admin: {
    description: 'Select a font for this component. Only fonts configured in Site Settings will be available.',
  },
  options: FONT_OPTIONS,
  ...overrides,
})

export const fontStyleFields: Field[] = [
  fontSelectorField(),
  {
    name: 'fontSize',
    type: 'select',
    label: 'Font Size',
    defaultValue: 'base',
    options: [
      { label: 'Extra Small', value: 'xs' },
      { label: 'Small', value: 'sm' },
      { label: 'Base', value: 'base' },
      { label: 'Large', value: 'lg' },
      { label: 'Extra Large', value: 'xl' },
      { label: '2X Large', value: '2xl' },
      { label: '3X Large', value: '3xl' },
      { label: '4X Large', value: '4xl' },
      { label: '5X Large', value: '5xl' },
      { label: '6X Large', value: '6xl' },
    ],
  },
  {
    name: 'fontWeight',
    type: 'select',
    label: 'Font Weight',
    defaultValue: 'normal',
    options: [
      { label: 'Thin', value: '100' },
      { label: 'Extra Light', value: '200' },
      { label: 'Light', value: '300' },
      { label: 'Normal', value: '400' },
      { label: 'Medium', value: '500' },
      { label: 'Semi Bold', value: '600' },
      { label: 'Bold', value: '700' },
      { label: 'Extra Bold', value: '800' },
      { label: 'Black', value: '900' },
    ],
  },
]
