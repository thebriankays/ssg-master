# Accordion Component

A flexible and accessible accordion component built with React and styled using SCSS with BEM naming convention.

## Features

- **Controlled & Uncontrolled modes**: Use as a controlled component with `value` and `onValueChange`, or uncontrolled with `defaultValue`
- **Single & Multiple selection**: Toggle between allowing one or multiple panels open simultaneously
- **Multiple variants**: Choose from `default`, `bordered`, `separated`, or `flush` styling
- **Accessible**: Full keyboard navigation and ARIA attributes
- **Smooth animations**: CSS-based height animations with proper handling
- **Customizable icons**: Support for custom icons with flexible positioning
- **Disabled state**: Individual items can be disabled
- **Dark mode support**: Automatic dark mode styling
- **Reduced motion**: Respects user's motion preferences

## Usage

### Basic Example

```tsx
import Accordion from '@/components/layout/Accordion'

// Single selection accordion
<Accordion type="single" defaultValue="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>
      Content for section 1
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Section 2</Accordion.Trigger>
    <Accordion.Content>
      Content for section 2
    </Accordion.Content>
  </Accordion.Item>
</Accordion>
```

### Controlled Example

```tsx
const [value, setValue] = useState<string>('item-1')

<Accordion type="single" value={value} onValueChange={setValue}>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Controlled Item</Accordion.Trigger>
    <Accordion.Content>
      This accordion is controlled by parent state
    </Accordion.Content>
  </Accordion.Item>
</Accordion>
```

### Multiple Selection

```tsx
<Accordion type="multiple" defaultValue={['item-1', 'item-3']}>
  {/* Multiple items can be open at once */}
</Accordion>
```

## Props

### Accordion

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'single' \| 'multiple'` | `'single'` | Whether one or multiple items can be open |
| `defaultValue` | `string \| string[]` | `undefined` | Default open items (uncontrolled) |
| `value` | `string \| string[]` | `undefined` | Open items (controlled) |
| `onValueChange` | `(value: string \| string[]) => void` | `undefined` | Callback when items change |
| `variant` | `'default' \| 'bordered' \| 'separated' \| 'flush'` | `'default'` | Visual style variant |
| `className` | `string` | `''` | Additional CSS classes |

### AccordionItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | Required | Unique identifier for the item |
| `disabled` | `boolean` | `false` | Whether the item is disabled |
| `className` | `string` | `''` | Additional CSS classes |

### AccordionTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `React.ReactNode` | `<ChevronDownIcon />` | Custom icon element |
| `iconPosition` | `'left' \| 'right'` | `'right'` | Icon position relative to text |
| `className` | `string` | `''` | Additional CSS classes |

### AccordionContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `forceMount` | `boolean` | `false` | Force content to remain in DOM when closed |
| `className` | `string` | `''` | Additional CSS classes |

## Styling

The component uses SCSS with BEM naming convention. Key classes:

- `.accordion` - Root container
- `.accordion__item` - Individual accordion item
- `.accordion__trigger` - Clickable header button
- `.accordion__content` - Collapsible content area
- `.accordion__icon` - Trigger icon

### Variants

- **Default**: Standard bordered accordion
- **Bordered**: Each item has individual borders with spacing
- **Separated**: Card-like items with shadows and backgrounds
- **Flush**: Minimal styling, no side padding

### CSS Variables

Customize appearance with CSS variables:

```css
.accordion {
  --accordion-border-color: #e5e7eb;
  --accordion-hover-bg: rgba(0, 0, 0, 0.02);
  --accordion-focus-color: #3b82f6;
  --accordion-item-bg: #f9fafb;
}
```

## Accessibility

- Full keyboard navigation (Enter/Space to toggle)
- Proper ARIA attributes (`aria-expanded`, `aria-hidden`)
- Focus indicators
- Screen reader friendly
- Respects `prefers-reduced-motion`

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- CSS animations with fallbacks
- Dark mode via `prefers-color-scheme`