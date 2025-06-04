import type { Marker, MarkerData } from '@/types'

import { parsePayloadLines } from '@/utils'

export default function markerParser(markersFromProps: (MarkerData | Marker)[]) {
  const markers = [],
    { length } = markersFromProps

  for (let i = 0; i < length; i++) {
    if ('duration' in markersFromProps[i]) {
      markers.push(markersFromProps[i])
      continue
    }

    const markerData: MarkerData = {
      duration: (markersFromProps[i] as Marker).dr,
      time: (markersFromProps[i] as Marker).tm,
    }

    try {
      markerData.payload = JSON.parse((markersFromProps[i] as Marker).cm)
    } catch (_) {
      try {
        markerData.payload = parsePayloadLines((markersFromProps[i] as Marker).cm)
      } catch (error) {
        markerData.payload = { name: (markersFromProps[i] as Marker).cm }
      }
    }
    markers.push(markerData)
  }

  return markers
}