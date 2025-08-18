import type { Field } from 'payload'

export const colorPickerField = ({
  name = 'color',
  label = 'Color Picker',
  admin = {},
} = {}): Field => {
  return {
    name,
    label,
    type: 'text',
    admin: {
      components: {
        Field: '@/fields/ColorPicker/ColorPickerClient',
      },
      ...admin,
    },
  }
}