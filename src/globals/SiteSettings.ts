// src/globals/SiteSettings.ts
import { colorPickerField } from '@/fields/ColorPicker/ColorPicker'
import { GlobalConfig } from 'payload'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
    description: 'Configure site-wide settings and appearance',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Collection Pages',
          fields: [
            // Removed destHero field temporarily
          ],
        },
        {
          label: 'General',
          fields: [
            {
              name: 'backgroundGradient',
              type: 'group',
              label: 'Global Background',
              admin: {
                description: 'Configure the global background effect',
              },
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  label: 'Background Type',
                  defaultValue: 'whatamesh',
                  options: [
                    { label: 'Whatamesh (WebGL Gradient)', value: 'whatamesh' },
                    { label: 'Simple Gradient', value: 'gradient' },
                    { label: 'None', value: 'none' },
                  ],
                },
                colorPickerField({ name: 'color1', label: 'Color 1', defaultValue: '#c3e4ff' }),
                colorPickerField({ name: 'color2', label: 'Color 2', defaultValue: '#6ec3f4' }),
                colorPickerField({ name: 'color3', label: 'Color 3', defaultValue: '#eae2ff' }),
                colorPickerField({ name: 'color4', label: 'Color 4', defaultValue: '#b9beff' }),
                {
                  name: 'whatameshSettings',
                  type: 'group',
                  label: 'Whatamesh Settings',
                  admin: {
                    condition: (data, siblingData) => siblingData?.type === 'whatamesh',
                  },
                  fields: [
                    {
                      name: 'darkenTop',
                      type: 'checkbox',
                      label: 'Darken Top',
                      defaultValue: false,
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
                      },
                    },
                    {
                      name: 'scale',
                      type: 'number',
                      label: 'Noise Scale',
                      defaultValue: 1,
                      min: 0.1,
                      max: 5,
                      admin: {
                        step: 0.1,
                      },
                    },
                    {
                      name: 'enableFluid',
                      type: 'checkbox',
                      label: 'Enable Fluid Effect',
                      defaultValue: false,
                    },
                  ],
                },
                {
                  name: 'presetSelector',
                  type: 'ui',
                  admin: {
                    components: {
                      Field: '@/components/GradientPresetSelector/GradientPresetSelector',
                    },
                  },
                },
              ],
            },
            {
              name: 'siteEmail',
              type: 'email',
              label: 'Site Email',
              admin: { description: 'Email address for contact or notifications' },
            },
          ],
        },
        {
          label: 'AI Configuration',
          fields: [
            {
              name: 'aiSettings',
              type: 'group',
              label: 'AI Model Settings',
              admin: {
                description: 'Configure AI models for various features across the site',
              },
              fields: [
                {
                  name: 'defaultProvider',
                  type: 'select',
                  label: 'Default AI Provider',
                  defaultValue: 'openai',
                  required: true,
                  options: [
                    { label: 'OpenAI (GPT)', value: 'openai' },
                    { label: 'Anthropic (Claude)', value: 'anthropic' },
                    { label: 'Google (Gemini)', value: 'google' },
                  ],
                },
                {
                  name: 'travelItinerary',
                  type: 'group',
                  label: 'Travel Itinerary Generator',
                  fields: [
                    {
                      name: 'provider',
                      type: 'select',
                      label: 'AI Provider',
                      defaultValue: 'inherit',
                      options: [
                        { label: 'Use Default', value: 'inherit' },
                        { label: 'OpenAI (GPT)', value: 'openai' },
                        { label: 'Anthropic (Claude)', value: 'anthropic' },
                        { label: 'Google (Gemini)', value: 'google' },
                      ],
                    },
                    {
                      name: 'model',
                      type: 'select',
                      label: 'Model',
                      admin: {
                        condition: (data, siblingData) =>
                          siblingData?.provider && siblingData.provider !== 'inherit',
                      },
                      options: [
                        // OpenAI Models
                        { label: 'GPT-4 Turbo', value: 'gpt-4-turbo-preview' },
                        { label: 'GPT-4', value: 'gpt-4' },
                        { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
                        // Anthropic Models
                        { label: 'Claude 3 Opus', value: 'claude-3-opus-20240229' },
                        { label: 'Claude 3 Sonnet', value: 'claude-3-sonnet-20240229' },
                        { label: 'Claude 3 Haiku', value: 'claude-3-haiku-20240307' },
                        // Google Models
                        { label: 'Gemini Pro', value: 'gemini-pro' },
                        { label: 'Gemini Pro Vision', value: 'gemini-pro-vision' },
                      ],
                    },
                    {
                      name: 'temperature',
                      type: 'number',
                      label: 'Temperature',
                      defaultValue: 0.7,
                      min: 0,
                      max: 2,
                      admin: {
                        description:
                          'Controls randomness. Lower = more focused, higher = more creative',
                        step: 0.1,
                      },
                    },
                    {
                      name: 'maxTokens',
                      type: 'number',
                      label: 'Max Tokens',
                      defaultValue: 4000,
                      min: 100,
                      max: 8000,
                      admin: {
                        description: 'Maximum length of the response',
                        step: 100,
                      },
                    },
                  ],
                },
                {
                  name: 'chat',
                  type: 'group',
                  label: 'AI Chat Assistant',
                  fields: [
                    {
                      name: 'provider',
                      type: 'select',
                      label: 'AI Provider',
                      defaultValue: 'inherit',
                      options: [
                        { label: 'Use Default', value: 'inherit' },
                        { label: 'OpenAI (GPT)', value: 'openai' },
                        { label: 'Anthropic (Claude)', value: 'anthropic' },
                        { label: 'Google (Gemini)', value: 'google' },
                      ],
                    },
                    {
                      name: 'model',
                      type: 'select',
                      label: 'Model',
                      admin: {
                        condition: (data, siblingData) =>
                          siblingData?.provider && siblingData.provider !== 'inherit',
                      },
                      options: [
                        // Same options as above
                        { label: 'GPT-4 Turbo', value: 'gpt-4-turbo-preview' },
                        { label: 'GPT-4', value: 'gpt-4' },
                        { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
                        { label: 'Claude 3 Opus', value: 'claude-3-opus-20240229' },
                        { label: 'Claude 3 Sonnet', value: 'claude-3-sonnet-20240229' },
                        { label: 'Claude 3 Haiku', value: 'claude-3-haiku-20240307' },
                        { label: 'Gemini Pro', value: 'gemini-pro' },
                      ],
                    },
                  ],
                },
                {
                  name: 'apiKeys',
                  type: 'group',
                  label: 'API Keys',
                  admin: {
                    description:
                      'Store your API keys securely. These should also be set in environment variables.',
                  },
                  fields: [
                    {
                      name: 'openai',
                      type: 'text',
                      label: 'OpenAI API Key',
                      admin: {
                        placeholder: 'sk-...',
                        description: 'Your OpenAI API key. Also set OPENAI_API_KEY in .env',
                      },
                    },
                    {
                      name: 'anthropic',
                      type: 'text',
                      label: 'Anthropic API Key',
                      admin: {
                        placeholder: 'sk-ant-...',
                        description: 'Your Anthropic API key. Also set ANTHROPIC_API_KEY in .env',
                      },
                    },
                    {
                      name: 'google',
                      type: 'text',
                      label: 'Google Gemini API Key',
                      admin: {
                        placeholder: 'AIza...',
                        description:
                          'Your Google Gemini API key. Also set GOOGLE_GEMINI_API_KEY in .env',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Social Media',
          fields: [
            {
              name: 'socialMediaAccounts',
              type: 'group',
              label: 'Connected Social Media Accounts',
              admin: {
                description: 'Manage your connected social media accounts for automated posting',
              },
              fields: [
                {
                  name: 'facebook',
                  type: 'group',
                  label: 'Facebook',
                  fields: [
                    { name: 'enabled', type: 'checkbox', label: 'Enable Facebook' },
                    {
                      name: 'pageId',
                      type: 'text',
                      label: 'Page ID',
                      admin: {
                        condition: (_, data) => data?.enabled,
                        readOnly: true,
                      },
                    },
                    {
                      name: 'pageName',
                      type: 'text',
                      label: 'Page Name',
                      admin: {
                        condition: (_, data) => data?.enabled,
                        readOnly: true,
                      },
                    },
                    {
                      name: 'accessToken',
                      type: 'text',
                      label: 'Access Token',
                      admin: {
                        condition: (_, data) => data?.enabled,
                        hidden: true,
                      },
                    },
                    {
                      name: 'tokenExpiry',
                      type: 'date',
                      label: 'Token Expiry',
                      admin: {
                        condition: (_, data) => data?.enabled,
                        readOnly: true,
                      },
                    },
                    {
                      name: 'connectButton',
                      type: 'ui',
                      admin: {
                        components: {
                          Field: '@/components/SocialMediaConnect/FacebookConnect',
                        },
                        condition: (_, data) => !data?.accessToken,
                      },
                    },
                    {
                      name: 'accountStatus',
                      type: 'ui',
                      admin: {
                        components: {
                          Field: '@/components/SocialMediaConnect/AccountStatus',
                        },
                        condition: (_, data) => data?.accessToken,
                      },
                    },
                  ],
                },
                {
                  name: 'instagram',
                  type: 'group',
                  label: 'Instagram',
                  fields: [
                    { name: 'enabled', type: 'checkbox', label: 'Enable Instagram' },
                    {
                      name: 'accountId',
                      type: 'text',
                      label: 'Account ID',
                      admin: {
                        condition: (_, data) => data?.enabled,
                        readOnly: true,
                      },
                    },
                    {
                      name: 'username',
                      type: 'text',
                      label: 'Username',
                      admin: {
                        condition: (_, data) => data?.enabled,
                        readOnly: true,
                      },
                    },
                    {
                      name: 'accessToken',
                      type: 'text',
                      label: 'Access Token',
                      admin: {
                        condition: (_, data) => data?.enabled,
                        hidden: true,
                      },
                    },
                    {
                      name: 'tokenExpiry',
                      type: 'date',
                      label: 'Token Expiry',
                      admin: {
                        condition: (_, data) => data?.enabled,
                        readOnly: true,
                      },
                    },
                    {
                      name: 'connectButton',
                      type: 'ui',
                      admin: {
                        components: {
                          Field: '@/components/SocialMediaConnect/InstagramConnect',
                        },
                        condition: (_, data) => !data?.accessToken,
                      },
                    },
                    {
                      name: 'accountStatus',
                      type: 'ui',
                      admin: {
                        components: {
                          Field: '@/components/SocialMediaConnect/AccountStatus',
                        },
                        condition: (_, data) => data?.accessToken,
                      },
                    },
                  ],
                },
                {
                  name: 'tiktok',
                  type: 'group',
                  label: 'TikTok',
                  fields: [
                    { name: 'enabled', type: 'checkbox', label: 'Enable TikTok' },
                    {
                      name: 'openId',
                      type: 'text',
                      label: 'Open ID',
                      admin: {
                        condition: (_, data) => data?.enabled,
                        readOnly: true,
                      },
                    },
                    {
                      name: 'displayName',
                      type: 'text',
                      label: 'Display Name',
                      admin: {
                        condition: (_, data) => data?.enabled,
                        readOnly: true,
                      },
                    },
                    {
                      name: 'accessToken',
                      type: 'text',
                      label: 'Access Token',
                      admin: {
                        condition: (_, data) => data?.enabled,
                        hidden: true,
                      },
                    },
                    {
                      name: 'refreshToken',
                      type: 'text',
                      label: 'Refresh Token',
                      admin: {
                        condition: (_, data) => data?.enabled,
                        hidden: true,
                      },
                    },
                    {
                      name: 'tokenExpiry',
                      type: 'date',
                      label: 'Token Expiry',
                      admin: {
                        condition: (_, data) => data?.enabled,
                        readOnly: true,
                      },
                    },
                    {
                      name: 'connectButton',
                      type: 'ui',
                      admin: {
                        components: {
                          Field: '@/components/SocialMediaConnect/TikTokConnect',
                        },
                        condition: (_, data) => !data?.accessToken,
                      },
                    },
                    {
                      name: 'accountStatus',
                      type: 'ui',
                      admin: {
                        components: {
                          Field: '@/components/SocialMediaConnect/AccountStatus',
                        },
                        condition: (_, data) => data?.accessToken,
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'socialMediaSettings',
              type: 'group',
              label: 'Social Media Settings',
              fields: [
                {
                  name: 'defaultHashtags',
                  type: 'array',
                  label: 'Default Hashtags',
                  dbName: 'default_tags', // Shortened database name to avoid constraint issues
                  admin: {
                    description: 'These hashtags will be suggested for all social media posts',
                  },
                  fields: [
                    {
                      name: 'hashtag',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'linkTracking',
                  type: 'checkbox',
                  label: 'Enable Link Tracking',
                  defaultValue: true,
                  admin: {
                    description: 'Track clicks on links shared on social media',
                  },
                },
                {
                  name: 'autoSchedule',
                  type: 'group',
                  label: 'Auto-Scheduling Settings',
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      label: 'Enable Auto-Scheduling',
                      defaultValue: false,
                    },
                    {
                      name: 'bestTimes',
                      type: 'array',
                      label: 'Best Posting Times',
                      dbName: 'best_times', // Shortened database name
                      admin: {
                        condition: (_, data) => data?.enabled,
                        description: 'Preferred times for auto-scheduling posts',
                      },
                      fields: [
                        {
                          name: 'day',
                          type: 'select',
                          dbName: 'day_of_week', // Shortened database name
                          options: [
                            { label: 'Monday', value: 'monday' },
                            { label: 'Tuesday', value: 'tuesday' },
                            { label: 'Wednesday', value: 'wednesday' },
                            { label: 'Thursday', value: 'thursday' },
                            { label: 'Friday', value: 'friday' },
                            { label: 'Saturday', value: 'saturday' },
                            { label: 'Sunday', value: 'sunday' },
                          ],
                        },
                        {
                          name: 'time',
                          type: 'text',
                          admin: {
                            placeholder: 'HH:MM (24-hour format)',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Legacy Socials',
          fields: [
            {
              name: 'emailSocial',
              type: 'group',
              label: 'Email',
              fields: [
                { name: 'enabled', type: 'checkbox', label: 'Enable Email' },
                {
                  name: 'address',
                  type: 'email',
                  label: 'Email Address',
                  admin: { condition: (_, data) => data?.enabled },
                },
              ],
            },
            {
              name: 'facebook',
              type: 'group',
              label: 'Facebook (Legacy)',
              fields: [
                { name: 'enabled', type: 'checkbox', label: 'Enable Facebook' },
                {
                  name: 'username',
                  type: 'text',
                  label: 'Facebook Username',
                  admin: { condition: (_, data) => data?.enabled },
                },
              ],
            },
            {
              name: 'instagram',
              type: 'group',
              label: 'Instagram (Legacy)',
              fields: [
                { name: 'enabled', type: 'checkbox', label: 'Enable Instagram' },
                {
                  name: 'username',
                  type: 'text',
                  label: 'Instagram Username',
                  admin: { condition: (_, data) => data?.enabled },
                },
              ],
            },
            {
              name: 'etsy',
              type: 'group',
              label: 'Etsy',
              fields: [
                { name: 'enabled', type: 'checkbox', label: 'Enable Etsy' },
                {
                  name: 'username',
                  type: 'text',
                  label: 'Etsy Username',
                  admin: { condition: (_, data) => data?.enabled },
                },
              ],
            },
            {
              name: 'x',
              type: 'group',
              label: 'X (Twitter)',
              fields: [
                { name: 'enabled', type: 'checkbox', label: 'Enable X' },
                {
                  name: 'username',
                  type: 'text',
                  label: 'X Username',
                  admin: { condition: (_, data) => data?.enabled },
                },
              ],
            },
            {
              name: 'github',
              type: 'group',
              label: 'GitHub',
              fields: [
                { name: 'enabled', type: 'checkbox', label: 'Enable GitHub' },
                {
                  name: 'username',
                  type: 'text',
                  label: 'GitHub Username',
                  admin: { condition: (_, data) => data?.enabled },
                },
              ],
            },
          ],
        },
        {
          label: 'Typography',
          fields: [
            {
              name: 'typography',
              type: 'group',
              label: 'Typography Settings',
              admin: {
                description: 'Configure fonts for different parts of your website',
              },
              fields: [
                // Primary Fonts
                {
                  name: 'primaryHeadingFont',
                  type: 'text',
                  label: 'Primary Heading Font (H1, H2)',
                  admin: {
                    description: 'Font for main headings like H1 and H2',
                    components: {
                      Field: '@/fields/GSAPFontPicker/GSAPFontPicker#GSAPFontPicker',
                    },
                  },
                },
                {
                  name: 'secondaryHeadingFont',
                  type: 'text',
                  label: 'Secondary Heading Font (H3, H4, H5, H6)',
                  admin: {
                    description: 'Font for smaller headings',
                    components: {
                      Field: '@/fields/GSAPFontPicker/GSAPFontPicker#GSAPFontPicker',
                    },
                  },
                },
                {
                  name: 'bodyFont',
                  type: 'text',
                  label: 'Body Text Font',
                  admin: {
                    description: 'Font for paragraphs and general text content',
                    components: {
                      Field: '@/fields/GSAPFontPicker/GSAPFontPicker#GSAPFontPicker',
                    },
                  },
                },

                // Special Purpose Fonts
                {
                  name: 'navigationFont',
                  type: 'text',
                  label: 'Navigation Font',
                  admin: {
                    description: 'Font for navigation menus and links',
                    components: {
                      Field: '@/fields/GSAPFontPicker/GSAPFontPicker#GSAPFontPicker',
                    },
                  },
                },
                {
                  name: 'buttonFont',
                  type: 'text',
                  label: 'Button Font',
                  admin: {
                    description: 'Font for buttons and CTAs',
                    components: {
                      Field: '@/fields/GSAPFontPicker/GSAPFontPicker#GSAPFontPicker',
                    },
                  },
                },
                {
                  name: 'quoteFont',
                  type: 'text',
                  label: 'Quote/Testimonial Font',
                  admin: {
                    description: 'Font for blockquotes and testimonials',
                    components: {
                      Field: '@/fields/GSAPFontPicker/GSAPFontPicker#GSAPFontPicker',
                    },
                  },
                },
                {
                  name: 'codeFont',
                  type: 'text',
                  label: 'Code/Monospace Font',
                  admin: {
                    description: 'Font for code blocks and monospace text',
                    components: {
                      Field: '@/fields/GSAPFontPicker/GSAPFontPicker#GSAPFontPicker',
                    },
                  },
                },

                // Font Scale Settings
                {
                  name: 'fontScale',
                  type: 'group',
                  label: 'Font Scale',
                  admin: {
                    description: 'Configure the type scale for your website',
                  },
                  fields: [
                    {
                      name: 'baseSize',
                      type: 'number',
                      label: 'Base Font Size (px)',
                      defaultValue: 16,
                      min: 12,
                      max: 24,
                      admin: {
                        description:
                          'Base font size in pixels. All other sizes will scale from this.',
                        step: 1,
                      },
                    },
                    {
                      name: 'scaleRatio',
                      type: 'select',
                      label: 'Scale Ratio',
                      defaultValue: '1.25',
                      options: [
                        { label: 'Minor Second (1.067)', value: '1.067' },
                        { label: 'Major Second (1.125)', value: '1.125' },
                        { label: 'Minor Third (1.2)', value: '1.2' },
                        { label: 'Major Third (1.25)', value: '1.25' },
                        { label: 'Perfect Fourth (1.333)', value: '1.333' },
                        { label: 'Augmented Fourth (1.414)', value: '1.414' },
                        { label: 'Perfect Fifth (1.5)', value: '1.5' },
                        { label: 'Golden Ratio (1.618)', value: '1.618' },
                      ],
                      admin: {
                        description: 'Mathematical ratio for scaling font sizes',
                      },
                    },
                  ],
                },

                // Global Typography Settings
                {
                  name: 'globalSettings',
                  type: 'group',
                  label: 'Global Typography Settings',
                  fields: [
                    {
                      name: 'lineHeight',
                      type: 'select',
                      label: 'Default Line Height',
                      defaultValue: '1.6',
                      options: [
                        { label: 'Tight (1.2)', value: '1.2' },
                        { label: 'Snug (1.4)', value: '1.4' },
                        { label: 'Normal (1.6)', value: '1.6' },
                        { label: 'Relaxed (1.8)', value: '1.8' },
                        { label: 'Loose (2)', value: '2' },
                      ],
                    },
                    {
                      name: 'letterSpacing',
                      type: 'select',
                      label: 'Default Letter Spacing',
                      defaultValue: 'normal',
                      options: [
                        { label: 'Tighter (-0.05em)', value: '-0.05' },
                        { label: 'Tight (-0.025em)', value: '-0.025' },
                        { label: 'Normal', value: 'normal' },
                        { label: 'Wide (0.025em)', value: '0.025' },
                        { label: 'Wider (0.05em)', value: '0.05' },
                        { label: 'Widest (0.1em)', value: '0.1' },
                      ],
                    },
                    {
                      name: 'paragraphSpacing',
                      type: 'number',
                      label: 'Paragraph Spacing (rem)',
                      defaultValue: 1.5,
                      min: 0.5,
                      max: 3,
                      admin: {
                        description: 'Space between paragraphs in rem units',
                        step: 0.1,
                      },
                    },
                  ],
                },

                // Font Loading Strategy
                {
                  name: 'fontLoading',
                  type: 'group',
                  label: 'Font Loading',
                  fields: [
                    {
                      name: 'strategy',
                      type: 'select',
                      label: 'Loading Strategy',
                      defaultValue: 'swap',
                      options: [
                        { label: 'Auto', value: 'auto' },
                        { label: 'Block', value: 'block' },
                        { label: 'Swap', value: 'swap' },
                        { label: 'Fallback', value: 'fallback' },
                        { label: 'Optional', value: 'optional' },
                      ],
                      admin: {
                        description: 'How fonts should be loaded and displayed',
                      },
                    },
                    {
                      name: 'preload',
                      type: 'checkbox',
                      label: 'Preload Critical Fonts',
                      defaultValue: true,
                      admin: {
                        description: 'Preload primary fonts for better performance',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
