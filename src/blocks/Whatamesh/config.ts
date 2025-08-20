import type { Block } from 'payload'

export const WhatameshBlock: Block = {
  slug: 'whatamesh',
  interfaceName: 'WhatameshBlock',
  labels: {
    singular: 'Whatamesh Background',
    plural: 'Whatamesh Backgrounds',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      label: 'Render Type',
      defaultValue: 'global',
      options: [
        {
          label: 'Global Background',
          value: 'global',
        },
        {
          label: 'Section Background',
          value: 'section',
        },
      ],
    },
    {
      name: 'colors',
      type: 'group',
      label: 'Color Palette',
      fields: [
        {
          name: 'color1',
          type: 'text',
          label: 'Color 1',
          defaultValue: '#c3e4ff',
          admin: {
            description: 'First gradient color (hex format)',
          },
        },
        {
          name: 'color2',
          type: 'text',
          label: 'Color 2',
          defaultValue: '#6ec3f4',
          admin: {
            description: 'Second gradient color (hex format)',
          },
        },
        {
          name: 'color3',
          type: 'text',
          label: 'Color 3',
          defaultValue: '#eae2ff',
          admin: {
            description: 'Third gradient color (hex format)',
          },
        },
        {
          name: 'color4',
          type: 'text',
          label: 'Color 4',
          defaultValue: '#b9beff',
          admin: {
            description: 'Fourth gradient color (hex format)',
          },
        },
      ],
    },
    {
      name: 'settings',
      type: 'group',
      label: 'Animation Settings',
      fields: [
        {
          name: 'darkenTop',
          type: 'checkbox',
          label: 'Darken Top',
          defaultValue: false,
          admin: {
            description: 'Apply darker gradient to top of animation',
          },
        },
        {
          name: 'speed',
          type: 'number',
          label: 'Animation Speed',
          defaultValue: 1,
          min: 0.1,
          max: 5,
          admin: {
            step: 0.1,
            description: 'Speed multiplier for the animation',
          },
        },
        {
          name: 'scale',
          type: 'number',
          label: 'Noise Scale',
          defaultValue: 1,
          min: 0.5,
          max: 3,
          admin: {
            step: 0.1,
            description: 'Scale of the noise pattern',
          },
        },
        {
          name: 'rotation',
          type: 'number',
          label: 'Rotation',
          defaultValue: 0,
          min: -180,
          max: 180,
          admin: {
            step: 15,
            description: 'Rotation angle in degrees',
          },
        },
      ],
    },
    {
      name: 'height',
      type: 'text',
      label: 'Height',
      defaultValue: '100vh',
      admin: {
        condition: (_, { type }) => type === 'section',
        description: 'Height of the section (e.g., 100vh, 500px)',
      },
    },
  ],
}
