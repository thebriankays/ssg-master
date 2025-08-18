import type { Block } from 'payload'

export const WebGLCarouselBlock: Block = {
  slug: 'webglCarouselBlock',
  interfaceName: 'WebGLCarouselBlock',
  fields: [
    {
      name: 'images',
      type: 'array',
      label: 'Carousel Images',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
      ],
    },
    {
      name: 'settings',
      type: 'group',
      label: 'Carousel Settings',
      fields: [
        {
          name: 'autoPlay',
          type: 'checkbox',
          label: 'Auto Play',
          defaultValue: false,
        },
        {
          name: 'autoPlayInterval',
          type: 'number',
          label: 'Auto Play Interval (ms)',
          defaultValue: 3000,
          min: 1000,
          max: 10000,
          admin: {
            condition: (_, { settings }) => settings?.autoPlay,
          },
        },
        {
          name: 'speed',
          type: 'number',
          label: 'Scroll Speed',
          defaultValue: 0.02,
          min: 0.01,
          max: 0.1,
          admin: {
            step: 0.01,
          },
        },
        {
          name: 'gap',
          type: 'number',
          label: 'Gap Between Slides',
          defaultValue: 0.1,
          min: 0,
          max: 0.5,
          admin: {
            step: 0.05,
          },
        },
        {
          name: 'planeWidth',
          type: 'number',
          label: 'Slide Width',
          defaultValue: 1,
          min: 0.5,
          max: 3,
          admin: {
            step: 0.1,
          },
        },
        {
          name: 'planeHeight',
          type: 'number',
          label: 'Slide Height',
          defaultValue: 2.5,
          min: 1,
          max: 4,
          admin: {
            step: 0.1,
          },
        },
      ],
    },
    {
      name: 'appearance',
      type: 'group',
      label: 'Appearance',
      fields: [
        {
          name: 'height',
          type: 'select',
          label: 'Height',
          defaultValue: 'default',
          options: [
            {
              label: 'Default (600px)',
              value: 'default',
            },
            {
              label: 'Small (400px)',
              value: 'small',
            },
            {
              label: 'Large (800px)',
              value: 'large',
            },
            {
              label: 'Full Screen',
              value: 'fullscreen',
            },
            {
              label: 'Viewport Height',
              value: 'viewport',
            },
          ],
        },
        {
          name: 'variant',
          type: 'select',
          label: 'Variant',
          defaultValue: 'default',
          options: [
            {
              label: 'Default',
              value: 'default',
            },
            {
              label: 'Contained',
              value: 'contained',
            },
            {
              label: 'Rounded',
              value: 'rounded',
            },
            {
              label: 'With Gradient',
              value: 'gradient',
            },
          ],
        },
        {
          name: 'showInfo',
          type: 'checkbox',
          label: 'Show Title & Description',
          defaultValue: true,
        },
        {
          name: 'showDots',
          type: 'checkbox',
          label: 'Show Navigation Dots',
          defaultValue: true,
        },
      ],
    },
  ],
}