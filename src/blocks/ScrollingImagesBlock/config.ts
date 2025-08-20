import type { Block } from 'payload'

export const ScrollingImagesBlock: Block = {
  slug: 'scrollImagesBlock',
  interfaceName: 'ScrollingImagesBlock',
  dbName: 'scroll_imgs',
  labels: {
    singular: 'Scrolling Images',
    plural: 'Scrolling Images Blocks',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Animation Variant',
      defaultValue: '3d',
      required: true,
      options: [
        {
          label: '3D Rotation',
          value: '3d',
        },
        {
          label: 'Scale X & Y',
          value: 'scaleXY',
        },
        {
          label: 'Scale & Opacity',
          value: 'scaleOpacity',
        },
      ],
      admin: {
        description: 'Choose the animation style for the scrolling images',
      },
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Number of Columns',
      defaultValue: '3',
      required: true,
      options: [
        {
          label: '1 Column',
          value: '1',
        },
        {
          label: '2 Columns',
          value: '2',
        },
        {
          label: '3 Columns',
          value: '3',
        },
        {
          label: '4 Columns',
          value: '4',
        },
        {
          label: '5 Columns',
          value: '5',
        },
        {
          label: '6 Columns',
          value: '6',
        },
      ],
      admin: {
        description: 'Number of columns in the grid (will be 1 on mobile)',
      },
    },
    {
      name: 'gap',
      type: 'select',
      label: 'Gap Between Images',
      defaultValue: '5vh',
      options: [
        {
          label: 'None',
          value: '0',
        },
        {
          label: 'Small (2vh)',
          value: '2vh',
        },
        {
          label: 'Medium (5vh)',
          value: '5vh',
        },
        {
          label: 'Large (8vh)',
          value: '8vh',
        },
        {
          label: 'Extra Large (10vh)',
          value: '10vh',
        },
      ],
    },
    {
      name: 'imageGroups',
      type: 'array',
      label: 'Image Groups',
      dbName: 'img_groups',
      required: true,
      minRows: 1,
      admin: {
        description: 'Add images in groups of 3 for best effect. The first group will be duplicated to create the infinite scroll effect.',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'groupName',
          type: 'text',
          label: 'Group Name',
          admin: {
            description: 'Optional name for this group (for organization)',
          },
        },
        {
          name: 'images',
          type: 'array',
          label: 'Images',
          required: true,
          minRows: 3,
          maxRows: 3,
          admin: {
            description: 'Add exactly 3 images per group',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Image will be displayed at 100vh height',
              },
            },
            {
              name: 'alt',
              type: 'text',
              label: 'Alt Text',
              admin: {
                description: 'Alternative text for accessibility',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'settings',
      type: 'group',
      label: 'Advanced Settings',
      dbName: 'sttgs',
      admin: {
        description: 'Fine-tune the scrolling behavior',
      },
      fields: [
        {
          name: 'infiniteScroll',
          type: 'checkbox',
          label: 'Enable Infinite Scroll',
          defaultValue: false,
          dbName: 'inf_scroll',
          admin: {
            description: 'When enabled with Lenis, creates a true infinite scroll loop',
          },
        },
        {
          name: 'imageHeight',
          type: 'select',
          label: 'Image Height',
          defaultValue: '100vh',
          admin: {
            description: 'Set the height of each image',
          },
          dbName: 'img_height',
          options: [
            {
              label: '50vh',
              value: '50vh',
            },
            {
              label: '60vh',
              value: '60vh',
            },
            {
              label: '70vh',
              value: '70vh',
            },
            {
              label: '80vh',
              value: '80vh',
            },
            {
              label: '90vh',
              value: '90vh',
            },
            {
              label: '100vh (Full Height)',
              value: '100vh',
            },
            {
              label: '110vh',
              value: '110vh',
            },
            {
              label: '120vh',
              value: '120vh',
            },
          ],
        },
        {
          name: 'className',
          type: 'text',
          label: 'Custom CSS Class',
          admin: {
            description: 'Add custom CSS classes for additional styling',
          },
        },
      ],
    },
  ],
}
