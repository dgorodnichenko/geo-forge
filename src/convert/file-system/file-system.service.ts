import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FileSystemService {
    private readonly tempDir = path.join(process.cwd(), 'temp');

    constructor() {
        this.ensureTempDirExists();
    }

    createTempFile(data: any, extension: string = 'json'): string {
        const tempFilename = `${randomUUID()}.${extension}`;
        const tempFilePath = path.join(this.tempDir, tempFilename);
        
        try {
            const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
            fs.writeFileSync(tempFilePath, content);
            return tempFilePath;
        } catch (error) {
            throw new BadRequestException(`Failed to create temp file: ${error.message}`);
        }
    }

    cleanup(filePath: string): void {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    private ensureTempDirExists(): void {
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }
}
