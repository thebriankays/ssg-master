# Typography Components

Typography components ensure consistent, accessible text rendering across your application with built-in responsive sizing and styling options.

## Heading Component

A flexible heading component that handles all heading levels with consistent styling and SEO optimization.

### Import

```tsx
import { Heading } from '@/components/typography/heading'
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | `'h2'` | HTML heading element |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl' \| '5xl'` | Based on `as` | Visual size |
| `weight` | `'light' \| 'normal' \| 'medium' \| 'semibold' \| 'bold' \| 'extrabold' \| 'black'` | `'bold'` | Font weight |
| `align` | `'left' \| 'center' \| 'right' \| 'justify'` | `'left'` | Text alignment |
| `color` | `string` | `'inherit'` | Text color (CSS value or Tailwind class) |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | required | Heading content |
| `id` | `string` | - | Element ID for anchoring |
| `tracking` | `'tighter' \| 'tight' \| 'normal' \| 'wide' \| 'wider' \| 'widest'` | `'normal'` | Letter spacing |
| `leading` | `'none' \| 'tight' \| 'snug' \| 'normal' \| 'relaxed' \| 'loose'` | `'tight'` | Line height |

### Usage Examples

#### Basic Headings
```tsx
<Heading as="h1">Welcome to Our Platform</Heading>
<Heading as="h2">Features Overview</Heading>
<Heading as="h3">Advanced Capabilities</Heading>
```

#### Custom Sizing
```tsx
// Large heading with h2 semantics
<Heading as="h2" size="4xl" weight="black">
  Big Impact Statement
</Heading>

// Small heading with h1 semantics
<Heading as="h1" size="lg" weight="medium">
  Subtle Page Title
</Heading>
```

#### Styled Headings
```tsx
<Heading 
  as="h1"
  size="5xl"
  weight="extrabold"
  align="center"
  tracking="tight"
  className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
>
  Gradient Heading
</Heading>
```

#### With Custom Color
```tsx
<Heading 
  as="h2"
  color="text-gray-700"
  weight="semibold"
>
  Subtle Section Title
</Heading>

<Heading 
  as="h3"
  color="#ff6b6b"
  weight="bold"
>
  Accent Color Heading
</Heading>
```

### Responsive Sizing

```tsx
// Responsive size based on viewport
<Heading 
  as="h1"
  className="text-3xl md:text-4xl lg:text-5xl"
>
  Responsive Heading
</Heading>

// Using size prop with responsive overrides
<Heading 
  as="h2"
  size="2xl"
  className="sm:text-3xl lg:text-4xl"
>
  Scalable Title
</Heading>
```

### Best Practices

1. **Maintain heading hierarchy**: Use proper semantic order (h1 → h2 → h3)
2. **One h1 per page**: For SEO optimization
3. **Consistent sizing**: Use the size system for visual consistency
4. **Accessible structure**: Don't skip heading levels
5. **Meaningful content**: Write descriptive, keyword-rich headings

## Text Component

A versatile text component for body copy, paragraphs, and inline text with consistent typography.

### Import

```tsx
import { Text } from '@/components/typography/text'
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `'p' \| 'span' \| 'div' \| 'label'` | `'p'` | HTML element |
| `size` | `'xs' \| 'sm' \| 'base' \| 'lg' \| 'xl' \| '2xl'` | `'base'` | Text size |
| `weight` | `'light' \| 'normal' \| 'medium' \| 'semibold' \| 'bold'` | `'normal'` | Font weight |
| `align` | `'left' \| 'center' \| 'right' \| 'justify'` | `'left'` | Text alignment |
| `color` | `string` | `'inherit'` | Text color |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | required | Text content |
| `leading` | `'none' \| 'tight' \| 'snug' \| 'normal' \| 'relaxed' \| 'loose'` | `'normal'` | Line height |
| `truncate` | `boolean \| number` | `false` | Truncate text (true or number of lines) |
| `prose` | `boolean` | `false` | Apply prose styling for rich text |

### Usage Examples

#### Basic Text
```tsx
<Text>
  This is a standard paragraph of text with default styling.
</Text>

<Text as="span" size="sm" color="text-gray-500">
  Small helper text
</Text>
```

#### Styled Paragraphs
```tsx
<Text 
  size="lg"
  leading="relaxed"
  className="max-w-3xl mx-auto"
>
  This is a larger paragraph with relaxed line height, 
  perfect for comfortable reading experiences.
</Text>
```

#### Truncated Text
```tsx
// Single line truncation
<Text truncate>
  This very long text will be truncated with an ellipsis when it exceeds the container width...
</Text>

// Multi-line truncation
<Text truncate={3}>
  This text will show a maximum of three lines before being truncated. 
  Any content beyond the third line will be hidden with an ellipsis 
  at the end of the visible text.
</Text>
```

#### Prose Styling
```tsx
<Text prose className="max-w-prose">
  <h3>Rich Content</h3>
  <p>
    When using the prose prop, the component applies optimized 
    typography for long-form content.
  </p>
  <ul>
    <li>Properly styled lists</li>
    <li>Optimized line lengths</li>
    <li>Consistent spacing</li>
  </ul>
</Text>
```

### Common Patterns

#### Card Description
```tsx
<div className="p-6 bg-white rounded-lg shadow">
  <Heading as="h3" size="xl" className="mb-2">
    Feature Title
  </Heading>
  <Text color="text-gray-600" className="mb-4">
    Brief description of the feature that explains its value 
    and primary benefits to users.
  </Text>
  <Link href="/learn-more" className="text-blue-600">
    Learn more →
  </Link>
</div>
```

#### Form Labels and Help Text
```tsx
<div className="space-y-2">
  <Text as="label" weight="medium" htmlFor="email">
    Email Address
  </Text>
  <input 
    id="email"
    type="email"
    className="w-full px-3 py-2 border rounded"
  />
  <Text size="sm" color="text-gray-500">
    We'll never share your email with anyone else.
  </Text>
</div>
```

#### Article Content
```tsx
<article className="max-w-4xl mx-auto">
  <Heading as="h1" size="4xl" className="mb-4">
    Article Title
  </Heading>
  
  <Text size="lg" color="text-gray-600" className="mb-8">
    Article subtitle or excerpt that provides context
  </Text>
  
  <Text prose>
    {articleContent}
  </Text>
</article>
```

### Styling Customization

#### Custom Font Families
```tsx
<Heading className="font-serif">
  Serif Heading
</Heading>

<Text className="font-mono">
  Monospace code snippet or technical content
</Text>
```

#### Gradient Text
```tsx
<Heading 
  as="h1"
  size="5xl"
  className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent"
>
  Gradient Typography
</Heading>
```

#### Text Shadows
```tsx
<Heading 
  className="text-white text-shadow-lg"
  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
>
  Text with Shadow
</Heading>
```

### Responsive Typography

```tsx
// Responsive heading
<Heading 
  as="h1"
  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
>
  Scales with Viewport
</Heading>

// Responsive body text
<Text 
  className="text-sm sm:text-base lg:text-lg"
  leading="tight sm:leading-normal lg:leading-relaxed"
>
  Body text that adjusts size and line height based on screen size
</Text>
```

### Typography Scale

The components use a consistent type scale:

| Size | Heading Default | Text Default |
|------|----------------|--------------|
| `xs` | 0.75rem | 0.75rem |
| `sm` | 0.875rem | 0.875rem |
| `base` | 1rem | 1rem |
| `lg` | 1.125rem | 1.125rem |
| `xl` | 1.25rem | 1.25rem |
| `2xl` | 1.5rem | 1.5rem |
| `3xl` | 1.875rem | - |
| `4xl` | 2.25rem | - |
| `5xl` | 3rem | - |

### Best Practices

1. **Consistent sizing**: Use the size prop instead of custom classes
2. **Semantic HTML**: Choose appropriate `as` prop values
3. **Color contrast**: Ensure sufficient contrast for readability
4. **Line length**: Keep text blocks under 75 characters wide
5. **Hierarchy**: Create clear visual hierarchy with size and weight

### Common Use Cases

#### Landing Page Hero
```tsx
<section className="py-20 text-center">
  <Heading 
    as="h1" 
    size="5xl" 
    weight="black"
    className="mb-6"
  >
    Build Better Products
  </Heading>
  
  <Text 
    size="xl" 
    color="text-gray-600"
    className="max-w-2xl mx-auto mb-8"
  >
    Our platform empowers teams to create exceptional 
    digital experiences with powerful tools and insights.
  </Text>
  
  <div className="flex gap-4 justify-center">
    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
      Get Started
    </button>
    <button className="px-6 py-3 border border-gray-300 rounded-lg">
      Learn More
    </button>
  </div>
</section>
```

#### Blog Post Layout
```tsx
<article className="prose lg:prose-xl mx-auto">
  <header className="not-prose mb-8">
    <Heading as="h1" size="4xl" className="mb-4">
      {post.title}
    </Heading>
    
    <div className="flex items-center gap-4 text-gray-600">
      <Text size="sm">{post.author}</Text>
      <span>•</span>
      <Text size="sm">{post.date}</Text>
      <span>•</span>
      <Text size="sm">{post.readTime} min read</Text>
    </div>
  </header>
  
  <Text prose>
    {post.content}
  </Text>
</article>
```

## Accessibility Features

Both typography components include:

- Semantic HTML elements
- Proper heading hierarchy
- Sufficient color contrast
- Responsive font sizing
- Screen reader friendly

## Performance

- Minimal runtime overhead
- No unnecessary re-renders
- Efficient className merging
- Tree-shakeable imports

## Internationalization

Typography components work seamlessly with RTL languages:

```tsx
<div dir="rtl">
  <Heading as="h1" align="right">
    عنوان باللغة العربية
  </Heading>
  <Text align="right">
    نص باللغة العربية يعمل بشكل صحيح
  </Text>
</div>
```