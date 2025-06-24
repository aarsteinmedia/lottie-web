import type { Marker, MarkerData } from '../types';
export default function markerParser(markersFromProps: (MarkerData | Marker)[]): (MarkerData | Marker | undefined)[];
