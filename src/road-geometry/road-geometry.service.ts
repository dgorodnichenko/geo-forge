import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { join } from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class RoadGeometryService {
    private readonly scriptPath: string;

    constructor() {
        this.scriptPath = join(__dirname, 'scripts', 'road_points.py');
    }

    async getRoadPoints(
        startLat: number,
        startLng: number,
        endLat: number,
        endLng: number
    ) {
        try {
            const command = `python "${this.scriptPath}" ${startLat} ${startLng} ${endLat} ${endLng}`;
            const { stdout, stderr } = await execAsync(command);
            console.log(stdout)
            console.log(stderr)
        
            if (stderr) console.error('Python stderr:', stderr);
            
            return JSON.parse(stdout);
        } catch (error) {
            throw new Error(`Failed to execute road_points.py script: ${error.message}`);
        }
    }
}
