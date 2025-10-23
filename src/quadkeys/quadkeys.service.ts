import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { readFile, unlink } from 'fs/promises';
import { join } from 'path';

export interface QuadkeyOptions {
  city: string;
  zoom?: number;
}

export interface QuadkeyResult {
  type: string;
  features: Array<{
    type: string;
    geometry: any;
    properties: {
      quadkey: string;
    };
  }>;
}

@Injectable()
export class QuadkeysService {
    private readonly logger = new Logger(QuadkeysService.name);
    private readonly pythonScriptPath: string;

    constructor() {
        this.pythonScriptPath = join(__dirname, 'scripts', 'get_quadkeys.py');
    }

    async generateQuadkeys(options: QuadkeyOptions): Promise<QuadkeyResult> {
        const { city, zoom = 14 } = options;

        this.logger.log(`Generating quadkeys for ${city} at zoom level ${zoom}`);

        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', [
                this.pythonScriptPath,
                city,
                zoom.toString(),
            ]);

            let stderr = '';

            pythonProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            pythonProcess.on('error', (error) => {
                this.logger.error(`Failed to start Python process: ${error.message}`);
                reject(new Error(`Failed to execute Python script: ${error.message}`));
            });

            pythonProcess.on('close', async (code) => {
            if (code !== 0) {
                this.logger.error(`Python script exited with code ${code}: ${stderr}`);
                reject(new Error(`Python script failed: ${stderr || 'Unknown error'}`));
                return;
            }

            try {
                const filename = `${city.toLowerCase()}_quadkeys_zoom${zoom}.geojson`;
                const filepath = join(process.cwd(), filename);
                
                const fileContent = await readFile(filepath, 'utf-8');
                const geojson = JSON.parse(fileContent);

                await unlink(filepath);

                this.logger.log(`Successfully generated ${geojson.features.length} quadkeys for ${city}`);
                resolve(geojson);
            } catch (error) {
                this.logger.error(`Failed to read generated file: ${error.message}`);
                reject(new Error(`Failed to read generated quadkeys: ${error.message}`));
            }
            });
        });
    }

    async generateQuadkeysWithoutCleanup(options: QuadkeyOptions): Promise<string> {
        const { city, zoom = 14 } = options;

        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python3', [
                this.pythonScriptPath,
                city,
                zoom.toString(),
            ]);

            let stderr = '';

            pythonProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            pythonProcess.on('error', (error) => {
                reject(new Error(`Failed to execute Python script: ${error.message}`));
            });

            pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python script failed: ${stderr || 'Unknown error'}`));
                return;
            }

            const filename = `${city.toLowerCase()}_quadkeys_zoom${zoom}.geojson`;
                resolve(filename);
            });
        });
    }
}
