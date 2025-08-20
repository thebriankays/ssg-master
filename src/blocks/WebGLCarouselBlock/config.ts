import type { Block } from 'payload'

export const WebGLCarouselBlock: Block = {
  slug: 'webglCarouselBlock',
  interfaceName: 'WebGLCarouselBlock',
  labels: {
    singular: 'WebGL Carousel',
    plural: 'WebGL Carousels',
  },
  fields: [
    {
      name: 'images',
      type: 'array',
      label: 'Carousel Images',
      required: true,
      minRows: 2,
      maxRows: 10,
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
          maxLength: 200,
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
          name: 'showDots',
          type: 'checkbox',
          label: 'Show Navigation Dots',
          defaultValue: true,
        },
        {
          name: 'showInfo',
          type: 'checkbox',
          label: 'Show Image Info',
          defaultValue: true,
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
          label: 'Image Gap',
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
          label: 'Image Width',
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
          label: 'Image Height',
          defaultValue: 2.5,
          min: 1,
          max: 4,
          admin: {
            step: 0.1,
          },
        },
      ],
    },
  ],
}
