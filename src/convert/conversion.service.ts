import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { ConversionType } from './constants/conversion-types.enum';
import { ConversionStrategyRegistry } from './registry/conversion-strategy-registry';
import { FileSystemService } from 'src/convert/file-system/file-system.service';
import { FileValidationService } from 'src/convert/file-validation/file-validation.service';
import { ProcessResult } from './interfaces/process-result';

@Injectable()
export class ConversionService {
    constructor(
        private readonly strategyRegistry: ConversionStrategyRegistry,
        private readonly fileSystemService: FileSystemService,
        private readonly fileValidationService: FileValidationService
    ) {}

    async processFile(file: Express.Multer.File, conversionType: ConversionType): Promise<ProcessResult> {
        const strategy = this.strategyRegistry.getStrategy(conversionType);
        
        this.fileValidationService.validateFileForConversion(file, strategy);
        const result = await strategy.convert(file);
        const tempFilePath = this.fileSystemService.createTempFile(result, strategy.getOutputExtension());
        
        const outputFilename = this.fileValidationService.generateOutputFilename(
            file.originalname, 
            strategy.getOutputExtension()
        );
        
        const cleanup = (err?: Error) => {
            this.fileSystemService.cleanup(tempFilePath);
            if (err) {
                console.error('Error during file processing:', err);
            }
        };

        return {
            filePath: path.resolve(tempFilePath),
            filename: outputFilename,
            cleanup
        };
    }

    async processKmzFileToGeojson(file: Express.Multer.File): Promise<ProcessResult> {
        return this.processFile(file, ConversionType.KMZ_TO_GEOJSON);
    }

    validateFileForConversion(file: Express.Multer.File, conversionType: ConversionType): void {
        const strategy = this.strategyRegistry.getStrategy(conversionType);
        this.fileValidationService.validateFileForConversion(file, strategy);
    }

    getSupportedFormats(): { input: string[], output: string[] } {
        return this.strategyRegistry.getSupportedFormats();
    }
}
