# Global Background System

The global background system allows you to easily switch between different background effects throughout your application.

## Features

- **Multiple Background Types**: Whatamesh gradients, simple gradients, particles (placeholder), or none
- **Preset System**: Pre-configured backgrounds with carefully chosen colors and settings
- **Theme-Aware**: Automatically switches between light and dark presets based on theme
- **Custom Configurations**: Create your own background configurations
- **Runtime Switching**: Change backgrounds dynamically at runtime

## Usage

### Basic Usage

The global background is automatically rendered by the layout. It reads configuration from `/src/config/global-background.ts`.

### Programmatic Control

Use the `useBackgroundControl` hook to change backgrounds at runtime:

```tsx
import { useBackgroundControl } from '@/components/GlobalBackground'

function MyComponent() {
  const { setBackground, setCustomBackground, presets } = useBackgroundControl()
  
  // Switch to a preset
  setBackground('sunset')
  
  // Apply custom configuration
  setCustomBackground({
    type: 'whatamesh',
    colors: {
      color1: '#ff6b6b',
      color2: '#4ecdc4',
      color3: '#45b7d1',
      color4: '#96ceb4',
    },
    settings: {
      darkenTop: false,
      speed: 2,
      scale: 0.8,
      amplitude: 400,
      rotation: 0,
    },
  })
}
```

## Available Presets

### Whatamesh Presets

- **ocean**: Soft blue waves (default)
- **sunset**: Warm gradient colors
- **forest**: Natural green tones
- **midnight**: Dark theme optimized

### Other Presets

- **minimal**: Simple CSS gradient
- **none**: No background

## Configuration

### Whatamesh Configuration

```typescript
{
  type: 'whatamesh',
  colors: {
    color1: string, // First gradient color
    color2: string, // Second gradient color
    color3: string, // Third gradient color
    color4: string, // Fourth gradient color
  },
  settings: {
    darkenTop: boolean,  // Darken the top portion
    speed: number,       // Animation speed (0.1 - 5)
    scale: number,       // Noise scale (0.5 - 3)
    amplitude: number,   // Wave amplitude (50 - 500)
    rotation: number,    // Rotation in radians
  }
}
```

### Gradient Configuration

```typescript
{
  type: 'gradient',
  colors: string[],    // Array of CSS colors
  angle: number,       // Gradient angle in degrees
  animated: boolean,   // Whether to animate (not implemented)
}
```

## Theme Integration

The background system automatically switches presets based on the current theme:

```typescript
themeOverrides: {
  dark: 'midnight',  // Preset to use in dark mode
  light: 'ocean',    // Preset to use in light mode
}
```

## Demo

Visit `/background-demo` to see all available presets and test custom configurations.