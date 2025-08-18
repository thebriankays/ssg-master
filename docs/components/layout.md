# Layout Components

Layout components provide structural elements that help organize and present content in flexible, responsive ways.

## Accordion Component

A collapsible content container that allows users to toggle visibility of content sections.

### Import

```tsx
import { Accordion } from '@/components/layout/accordion'
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `AccordionItem[]` | required | Array of accordion items |
| `allowMultiple` | `boolean` | `false` | Allow multiple items open simultaneously |
| `defaultOpen` | `number \| number[]` | - | Initially open item(s) by index |
| `animated` | `boolean` | `true` | Enable open/close animations |
| `className` | `string` | - | Additional CSS classes |
| `headerClassName` | `string` | - | Class for header elements |
| `contentClassName` | `string` | - | Class for content elements |
| `onChange` | `(openItems: number[]) => void` | - | Callback when items change |

#### AccordionItem Interface
```tsx
interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
}
```

### Usage Examples

#### Basic FAQ Accordion
```tsx
const faqItems = [
  {
    id: 'faq-1',
    title: 'What is your return policy?',
    content: 'We offer a 30-day return policy for all products...'
  },
  {
    id: 'faq-2',
    title: 'How long does shipping take?',
    content: 'Standard shipping takes 5-7 business days...'
  }
]

<Accordion items={faqItems} />
```

#### Multiple Open Sections
```tsx
<Accordion 
  items={productFeatures}
  allowMultiple={true}
  defaultOpen={[0, 1]}
  className="space-y-4"
/>
```

#### With Icons and Custom Styling
```tsx
const menuSections = [
  {
    id: 'appetizers',
    title: 'Appetizers',
    icon: <AppetizerIcon />,
    content: <MenuItems category="appetizers" />
  },
  {
    id: 'main-courses',
    title: 'Main Courses',
    icon: <MainCourseIcon />,
    content: <MenuItems category="mains" />
  }
]

<Accordion 
  items={menuSections}
  headerClassName="flex items-center gap-3 text-lg font-semibold"
  contentClassName="pl-9 text-gray-600"
/>
```

#### Controlled Accordion
```tsx
const [openItems, setOpenItems] = useState<number[]>([0])

<Accordion 
  items={sections}
  allowMultiple={true}
  onChange={setOpenItems}
  defaultOpen={openItems}
/>
```

### Styling Customization

```tsx
// Minimal style
<Accordion 
  items={items}
  className="divide-y divide-gray-200"
  headerClassName="py-4 hover:text-blue-600 transition-colors"
  contentClassName="pb-4 text-sm"
/>

// Card style
<Accordion 
  items={items}
  className="space-y-4"
  headerClassName="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
  contentClassName="bg-gray-50 p-4 rounded-b-lg"
/>
```

### Best Practices

1. **Keep titles concise**: Use clear, descriptive headers
2. **Organize logically**: Group related content together
3. **Consider default state**: Open important sections by default
4. **Provide visual feedback**: Use icons or indicators for state
5. **Ensure keyboard navigation**: Support Tab and Enter keys

## Fold Component

A reveal component that unfolds content with smooth animations, perfect for progressive disclosure.

### Import

```tsx
import { Fold } from '@/components/layout/fold'
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | required | Content to reveal |
| `trigger` | `'hover' \| 'click' \| 'scroll' \| 'auto'` | `'scroll'` | What triggers the fold |
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | Unfold direction |
| `duration` | `number` | `0.6` | Animation duration in seconds |
| `delay` | `number` | `0` | Animation delay in seconds |
| `ease` | `string` | `'power2.inOut'` | GSAP easing function |
| `threshold` | `number` | `0.2` | Scroll trigger threshold (0-1) |
| `className` | `string` | - | Additional CSS classes |
| `onFold` | `() => void` | - | Callback when fold opens |
| `onUnfold` | `() => void` | - | Callback when fold closes |

### Usage Examples

#### Basic Scroll-Triggered Fold
```tsx
<Fold trigger="scroll" direction="up">
  <div className="p-8 bg-white rounded-lg shadow-lg">
    <h2>Discover More</h2>
    <p>This content appears as you scroll.</p>
  </div>
</Fold>
```

#### Click-to-Reveal Content
```tsx
<Fold trigger="click" direction="down" duration={0.4}>
  <div className="hidden-details">
    <h3>Additional Information</h3>
    <ul>
      <li>Feature 1</li>
      <li>Feature 2</li>
      <li>Feature 3</li>
    </ul>
  </div>
</Fold>
```

#### Horizontal Fold for Images
```tsx
<Fold 
  trigger="hover" 
  direction="right"
  duration={0.8}
  className="inline-block"
>
  <img 
    src="/secret-image.jpg" 
    alt="Hidden treasure"
    className="w-64 h-64 object-cover"
  />
</Fold>
```

#### Staggered Fold Sequence
```tsx
<div className="space-y-8">
  {features.map((feature, index) => (
    <Fold 
      key={feature.id}
      trigger="scroll"
      delay={index * 0.1}
      threshold={0.3}
    >
      <FeatureCard {...feature} />
    </Fold>
  ))}
</div>
```

### Styling Customization

```tsx
// Card reveal effect
<Fold 
  className="bg-gradient-to-br from-purple-500 to-pink-500 p-1 rounded-xl"
  trigger="scroll"
>
  <div className="bg-white p-6 rounded-lg">
    <h3 className="text-2xl font-bold mb-4">Premium Feature</h3>
    <p>Unlock advanced capabilities...</p>
  </div>
</Fold>

// Masked text reveal
<Fold 
  direction="left"
  className="overflow-hidden"
  duration={1}
>
  <h1 className="text-6xl font-black">
    REVEALED
  </h1>
</Fold>
```

### Best Practices

1. **Use appropriate triggers**: Match trigger type to user interaction patterns
2. **Consider mobile**: Test touch interactions on mobile devices
3. **Avoid overuse**: Too many folds can be overwhelming
4. **Provide context**: Give users hints about interactive elements
5. **Ensure content accessibility**: Content should be accessible without JavaScript

## Scrollbar Component

A custom scrollbar implementation that provides consistent styling across browsers and platforms.

### Import

```tsx
import { Scrollbar } from '@/components/layout/scrollbar'
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | required | Scrollable content |
| `height` | `string \| number` | `'100%'` | Container height |
| `width` | `string \| number` | `'100%'` | Container width |
| `autoHide` | `boolean` | `true` | Hide scrollbar when not scrolling |
| `autoHideDelay` | `number` | `1000` | Delay before hiding (ms) |
| `thumbColor` | `string` | `'#666'` | Scrollbar thumb color |
| `trackColor` | `string` | `'#f1f1f1'` | Scrollbar track color |
| `thickness` | `number` | `8` | Scrollbar thickness (px) |
| `radius` | `number` | `4` | Scrollbar border radius (px) |
| `onScroll` | `(e: ScrollEvent) => void` | - | Scroll event handler |
| `className` | `string` | - | Additional CSS classes |

### Usage Examples

#### Basic Custom Scrollbar
```tsx
<Scrollbar height="400px">
  <div className="p-4">
    {/* Long content that requires scrolling */}
    {longContent}
  </div>
</Scrollbar>
```

#### Styled Code Block
```tsx
<Scrollbar 
  height="300px"
  thumbColor="#4a5568"
  trackColor="#1a202c"
  thickness={6}
  className="bg-gray-900 text-green-400 p-4 font-mono"
>
  <pre>{codeContent}</pre>
</Scrollbar>
```

#### Chat Interface
```tsx
<Scrollbar 
  height="500px"
  autoHide={false}
  className="border rounded-lg"
  onScroll={(e) => {
    if (e.target.scrollTop === 0) {
      loadMoreMessages()
    }
  }}
>
  <div className="p-4 space-y-2">
    {messages.map(msg => (
      <ChatMessage key={msg.id} {...msg} />
    ))}
  </div>
</Scrollbar>
```

#### Horizontal Scrolling Gallery
```tsx
<Scrollbar 
  width="100%"
  height="200px"
  thumbColor="#3b82f6"
  className="overflow-x-auto overflow-y-hidden"
>
  <div className="flex gap-4 p-4">
    {images.map(img => (
      <img 
        key={img.id}
        src={img.src}
        alt={img.alt}
        className="h-40 w-auto"
      />
    ))}
  </div>
</Scrollbar>
```

### Styling Customization

```tsx
// Dark theme scrollbar
<Scrollbar 
  thumbColor="#e5e7eb"
  trackColor="#374151"
  thickness={10}
  radius={5}
  className="bg-gray-800 text-white"
>
  {content}
</Scrollbar>

// Minimal scrollbar
<Scrollbar 
  thickness={4}
  thumbColor="rgba(0,0,0,0.3)"
  trackColor="transparent"
  autoHide={true}
  autoHideDelay={500}
>
  {content}
</Scrollbar>
```

### Best Practices

1. **Maintain native behavior**: Ensure scroll physics feel natural
2. **Consider touch devices**: Test on tablets and phones
3. **Provide sufficient contrast**: Ensure scrollbar is visible
4. **Don't hide critical UI**: Avoid covering content with scrollbar
5. **Test across browsers**: Verify consistent behavior

### Common Use Cases

#### Dashboard Layout
```tsx
<div className="flex h-screen">
  <aside className="w-64 bg-gray-100">
    <Scrollbar>
      <Navigation items={navItems} />
    </Scrollbar>
  </aside>
  
  <main className="flex-1">
    <Scrollbar>
      <div className="p-8">
        <DashboardContent />
      </div>
    </Scrollbar>
  </main>
</div>
```

#### Modal with Scrollable Content
```tsx
<Modal isOpen={isOpen} onClose={onClose}>
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>
    <Scrollbar height="400px" className="mb-4">
      <div className="prose">
        {termsContent}
      </div>
    </Scrollbar>
    <button onClick={onClose}>Accept</button>
  </div>
</Modal>
```

#### Data Table Container
```tsx
<div className="border rounded-lg overflow-hidden">
  <Scrollbar height="600px">
    <table className="w-full">
      <thead className="sticky top-0 bg-gray-50">
        <tr>
          {columns.map(col => (
            <th key={col.id}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <DataRow key={row.id} {...row} />
        ))}
      </tbody>
    </table>
  </Scrollbar>
</div>
```

## Performance Considerations

### Accordion
- Only renders active content to minimize DOM size
- Smooth animations using CSS transitions
- Efficient event handling with delegation

### Fold
- Lazy initialization of animations
- ScrollTrigger optimization for multiple instances
- Automatic cleanup of animation instances

### Scrollbar
- Native scroll performance maintained
- Virtual scrolling support for large lists
- Debounced scroll events for better performance

## Accessibility Features

All layout components are built with accessibility in mind:

- **Accordion**: ARIA attributes, keyboard navigation, focus management
- **Fold**: Preserves content accessibility, respects reduced motion
- **Scrollbar**: Maintains native scroll behavior, keyboard support

## Responsive Design

All components are mobile-first and responsive:

```tsx
// Responsive accordion
<Accordion 
  items={items}
  headerClassName="text-base md:text-lg lg:text-xl"
  contentClassName="text-sm md:text-base"
/>

// Responsive scrollbar
<Scrollbar 
  height={{ base: '300px', md: '400px', lg: '500px' }}
  thickness={{ base: 6, md: 8, lg: 10 }}
>
  {content}
</Scrollbar>
```