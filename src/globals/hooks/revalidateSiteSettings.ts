import type { GlobalAfterChangeHook } from 'payload'

export const revalidateSiteSettings: GlobalAfterChangeHook = ({ doc, req }) => {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) {
    return doc
  }

  try {
    // Revalidate the global cache tag
    import('next/cache').then(({ revalidateTag }) => {
      revalidateTag('global_site-settings')
    })
  } catch (error) {
    console.error('[revalidateSiteSettings] Error revalidating:', error)
  }

  return doc
}