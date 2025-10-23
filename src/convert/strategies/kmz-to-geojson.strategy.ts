import * as AdmZip from 'adm-zip';
import { ConversionStrategy } from "../interfaces/conversion-strategy";
import { BadRequestException, Injectable } from "@nestjs/common";
import { kml } from "@mapbox/togeojson";
import { DOMParser } from 'xmldom';

@Injectable()
export class KmzToGeojsonStrategy implements ConversionStrategy {
    async convert(file: Express.Multer.File): Promise<any> {
        try {
            const buffer = file.buffer;
            const zip = new AdmZip(buffer);
            const entries = zip.getEntries();

            const kmlEntry = entries.find((e) => e.entryName.endsWith('.kml'));
            if (!kmlEntry) {
                throw new BadRequestException('KML not found inside KMZ');
            }

            const kmlContent = kmlEntry.getData().toString('utf8');
            const dom = new DOMParser().parseFromString(kmlContent, 'text/xml');
            const geojson = kml(dom);

            return geojson;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException(`KMZ conversion failed: ${error.message}`);
        }
    }
    
    getSupportedExtensions(): string[] {
        return ['kmz'];
    }
    getOutputExtension(): string {
        return 'geojson';
    }
    getMimeTypes(): string[] {
        return [
            'application/vnd.google-earth.kmz',
            'application/zip',
            'application/x-zip-compressed',
            'application/octet-stream'
        ];
    }
}