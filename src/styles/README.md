# SCSS Architecture Documentation

## Overview

This SCSS architecture provides a comprehensive styling system that integrates with the existing Tailwind setup while offering additional features and organization. The system follows BEM methodology, supports dark mode, and includes responsive design utilities.

## File Structure

```
src/styles/
├── main.scss          # Main entry point
├── _variables.scss    # SCSS variables
├── _mixins.scss       # Utility mixins
├── _base.scss         # Base styles and CSS reset
├── _layout.scss       # Layout utilities
├── _animations.scss   # Animation utilities and keyframes
├── _responsive.scss   # Responsive utilities
├── _theme.scss        # Theme configuration and CSS custom properties
├── _utilities.scss    # Utility classes
└── README.md          # This documentation
```

## Architecture Layers

The SCSS files are organized in layers, imported in a specific order in `main.scss`:

1. **Configuration Layer** - Variables and mixins that don't output CSS
2. **Base Layer** - CSS reset and base element styles
3. **Theme Layer** - CSS custom properties for runtime theming
4. **Layout Layer** - Layout utilities and grid systems
5. **Components Layer** - Component-specific styles (as needed)
6. **Utilities Layer** - Single-purpose utility classes
7. **Animation Layer** - Animation keyframes and utilities
8. **Responsive Layer** - Responsive design utilities

## Key Features

### 1. Theme System

The theme system uses CSS custom properties for runtime theme switching:

```scss
// Light theme (default)
:root {
  --background: #ffffff;
  --foreground: #18181b;
  --primary: #1a1a2e;
  // ... more variables
}

// Dark theme
[data-theme='dark'] {
  --background: #18181b;
  --foreground: #fafafa;
  --primary: #3282b8;
  // ... more variables
}
```

### 2. Responsive Design

The system includes comprehensive responsive utilities:

```scss
// Breakpoints
$breakpoints: (
  xs: 475px,
  sm: 640px,
  md: 768px,
  lg: 1024px,
  xl: 1280px,
  2xl: 1536px
);

// Usage in components
.component {
  padding: 1rem;
  
  @include breakpoint(md) {
    padding: 2rem;
  }
}

// Responsive utility classes
.md:hidden { /* Hidden on medium screens and up */ }
.lg:flex { /* Flex on large screens and up */ }
```

### 3. Layout System

The layout system provides:

- **Container utilities** - `.container`, `.container-fluid`
- **Grid system** - `.grid`, `.grid-cols-{1-12}`
- **Flexbox utilities** - `.flex`, `.justify-center`, `.items-center`
- **Spacing utilities** - `.m-{size}`, `.p-{size}`
- **Position utilities** - `.absolute`, `.relative`, `.fixed`

### 4. Animation System

Comprehensive animation utilities:

```scss
// Pre-defined animations
.animate-fade-in
.animate-slide-up
.animate-bounce
.animate-spin

// Transition utilities
.transition-all
.duration-300
.ease-in-out

// Transform utilities
.scale-105
.rotate-45
.translate-x-full
```

### 5. Typography System

The system extends the existing typography.scss with additional utilities:

```scss
// Fluid typography
@include fluid-type($min-size, $max-size);

// Text utilities
.text-truncate
.line-clamp-3
.font-smooth
```

## Usage Guidelines

### 1. BEM Methodology

Follow BEM naming convention for component styles:

```scss
// Block
.card {
  // Element
  &__header {
    // Modifier
    &--highlighted {
      background: var(--accent);
    }
  }
}
```

### 2. Using Mixins

Common mixin patterns:

```scss
// Responsive breakpoints
.component {
  @include breakpoint(md) {
    // Styles for medium screens and up
  }
}

// Container
.section {
  @include container;
}

// Dark mode
.element {
  color: var(--foreground);
  
  @include dark-mode {
    color: var(--primary);
  }
}
```

### 3. Utility-First Approach

Combine utility classes for common patterns:

```html
<!-- Card with shadow and padding -->
<div class="bg-surface rounded-lg shadow-md p-6">
  <h3 class="text-xl font-semibold mb-4">Title</h3>
  <p class="text-foreground-secondary">Content</p>
</div>

<!-- Responsive flex container -->
<div class="flex flex-col md:flex-row gap-4 items-center">
  <!-- Items -->
</div>
```

### 4. Animation Usage

Apply animations with consideration for accessibility:

```html
<!-- Simple fade-in -->
<div class="animate-fade-in">Content</div>

<!-- Motion-safe animation -->
<div class="motion-safe:animate-bounce">Bouncing element</div>

<!-- Custom transition -->
<button class="transition-all duration-200 hover:scale-105">
  Click me
</button>
```

## Integration with Tailwind

This SCSS architecture complements Tailwind by:

1. **Extending utilities** - Additional utilities not available in Tailwind
2. **Custom properties** - Runtime theming via CSS variables
3. **Mixins** - Reusable patterns for component development
4. **BEM components** - Structure for complex component styles

### Using with Tailwind

```scss
// In component SCSS
.custom-component {
  @apply flex items-center; // Use Tailwind utilities
  @include container; // Use custom mixins
  background: var(--surface); // Use CSS variables
}
```

## Best Practices

1. **Use CSS Variables for Theming** - Prefer `var(--color)` over `$color` for theme-able properties
2. **Mobile-First Design** - Write base styles for mobile, then add breakpoints for larger screens
3. **Minimize Specificity** - Use utility classes and BEM to keep specificity low
4. **Performance** - Use `will-change` sparingly and remove after animations
5. **Accessibility** - Always test with `prefers-reduced-motion` and keyboard navigation

## Customization

### Adding New Breakpoints

In `_variables.scss`:

```scss
$breakpoints: (
  // ... existing breakpoints
  3xl: 1920px,
  4xl: 2560px
);
```

### Adding New Colors

In `_variables.scss` and `_theme.scss`:

```scss
// In _variables.scss
$color-tertiary: #abc123;

// In _theme.scss
:root {
  --color-tertiary: #{$color-tertiary};
}
```

### Creating Component Styles

Create a new file in a `components` directory:

```scss
// components/_button.scss
.btn {
  @include reset-button;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: var(--transition-base);
  
  &--primary {
    background: var(--primary);
    color: var(--primary-foreground);
  }
  
  &--large {
    padding: 0.75rem 1.5rem;
    font-size: $font-size-lg;
  }
}
```

## Debug Mode

Enable debug utilities by setting `$debug-mode: true` in `_variables.scss`:

```scss
$debug-mode: true; // Enable debug utilities

// Usage
<div class="debug">This has a red outline</div>
<div class="debug-children">All children have blue outlines</div>
<div class="debug-grid">Shows an 8px grid overlay</div>
```

## Browser Support

This architecture supports modern browsers with fallbacks:

- CSS Custom Properties - IE11 requires fallbacks
- CSS Grid - IE11 requires prefixes
- Flexbox - Full support
- `clamp()` for fluid typography - No IE support
- `backdrop-filter` - Limited support, includes feature detection

## Performance Considerations

1. **Minimize Imports** - Only import needed components
2. **Use CSS Variables** - Better performance than runtime SCSS calculations
3. **Optimize Animations** - Use `transform` and `opacity` for best performance
4. **Lazy Load Components** - Split component styles into separate files

## Maintenance

1. **Keep Files Focused** - Each file should have a single responsibility
2. **Document Complex Mixins** - Add comments explaining usage
3. **Version Control** - Track changes to variables and breaking changes
4. **Regular Audits** - Remove unused styles and optimize