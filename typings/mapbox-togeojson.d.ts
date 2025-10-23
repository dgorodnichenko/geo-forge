declare module '@mapbox/togeojson' {
    export interface GeoJSON {
        type: string;
        features?: Feature[];
        [key: string]: any;
    }

    export interface Feature {
        type: 'Feature';
        geometry: Geometry;
        properties: { [key: string]: any };
    }

    export interface Geometry {
        type: string;
        coordinates: any[];
    }

    export function kml(doc: Document): GeoJSON;
    export function gpx(doc: Document): GeoJSON;
}