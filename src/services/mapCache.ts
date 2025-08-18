import type { Payload } from 'payload'

interface PlaceData {
  place_id: string
  name: string
  vicinity: string
  rating?: number
  user_ratings_total?: number
  types: string[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  icon?: string
  photos?: any[]
  business_status?: string
  price_level?: number
}

interface Coordinates {
  lat: number
  lng: number
}

class MapCacheService {
  private payload: Payload

  constructor(payload: Payload) {
    this.payload = payload
  }

  private generateCacheKey(coordinates: Coordinates, radius: number, types: string[]): string {
    const sortedTypes = [...types].sort()
    return `${coordinates.lat},${coordinates.lng}-${radius}-${sortedTypes.join(',')}`
  }

  async getCachedPlaces(
    coordinates: Coordinates,
    radius: number,
    types: string[]
  ): Promise<PlaceData[] | null> {
    try {
      const cacheKey = this.generateCacheKey(coordinates, radius, types)
      
      const cached = await this.payload.find({
        collection: 'mapDataCache',
        where: {
          cacheKey: {
            equals: cacheKey,
          },
          expiresAt: {
            greater_than: new Date(),
          },
        },
        limit: 1,
      })

      if (cached.docs.length === 0) {
        return null
      }

      const cacheDoc = cached.docs[0]
      return cacheDoc.data as PlaceData[]
    } catch (error) {
      console.error('Error getting cached places:', error)
      return null
    }
  }

  async setCachedPlaces(
    destinationId: string,
    coordinates: Coordinates,
    radius: number,
    types: string[],
    places: PlaceData[]
  ): Promise<void> {
    try {
      const cacheKey = this.generateCacheKey(coordinates, radius, types)
      
      // Set expiry to 7 days from now
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      await this.payload.create({
        collection: 'mapDataCache',
        data: {
          destinationId,
          cacheKey,
          coordinates,
          radius,
          types,
          data: places,
          expiresAt,
        },
      })
    } catch (error) {
      console.error('Error setting cached places:', error)
    }
  }

  async clearExpiredCache(): Promise<void> {
    try {
      await this.payload.delete({
        collection: 'mapDataCache',
        where: {
          expiresAt: {
            less_than: new Date(),
          },
        },
      })
    } catch (error) {
      console.error('Error clearing expired cache:', error)
    }
  }

  async clearCacheForDestination(destinationId: string): Promise<void> {
    try {
      await this.payload.delete({
        collection: 'mapDataCache',
        where: {
          destinationId: {
            equals: destinationId,
          },
        },
      })
    } catch (error) {
      console.error('Error clearing cache for destination:', error)
    }
  }
}

export function getMapCacheService(payload: Payload): MapCacheService {
  return new MapCacheService(payload)
}