import React from 'react'
import type { ScrollingImagesBlock as ScrollingImagesBlockType, Media } from '@/payload-types'
import { ScrollingImages } from '@/components/ScrollingImages'

export const ScrollingImagesBlock: React.FC<ScrollingImagesBlockType> = ({
  variant,
  columns,
  gap,
  imageGroups,
  settings,
}) => {
  // Process images server-side
  const allImages = imageGroups?.flatMap(group => 
    group.images?.map(item => {
      // Handle the case where image might be a number (ID) or Media object
      if (!item.image || typeof item.image === 'number') {
        return null
      }
      
      return {
        image: item.image as Media,
        alt: item.alt || '',
      }
    }).filter((item): item is { image: Media; alt: string } => item !== null) || []
  ) || []

  // If no images, show a placeholder
  if (allImages.length === 0) {
    return (
      <div className="scrolling-images-block scrolling-images-block--empty">
        <p style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          No images added to the Scrolling Images block. Please add images in groups of 3.
        </p>
      </div>
    )
  }

  // Parse columns as number
  const columnCount = parseInt(columns || '3', 10)

  return (
    <ScrollingImages
      images={allImages}
      variant={variant as any || '3d'}
      columns={columnCount}
      gap={gap || '5vh'}
      imageHeight={settings?.imageHeight || '100vh'}
      infiniteScroll={settings?.infiniteScroll || false}
      className={settings?.className || ''}
    />
  )
}
