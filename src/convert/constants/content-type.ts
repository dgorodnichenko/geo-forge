const CONTENT_TYPES = {
    JSON: 'application/json',
    GEOJSON: 'application/geo+json',
    KML: 'application/vnd.google-earth.kml+xml',
    KMZ: 'application/vnd.google-earth.kmz',
} as const;

export type ContentType = keyof typeof CONTENT_TYPES;