import { BadRequestException, Injectable } from '@nestjs/common';
import { ConversionStrategy } from 'src/convert/interfaces/conversion-strategy';

@Injectable()
export class FileValidationService {
    validateFileForConversion(file: Express.Multer.File, strategy: ConversionStrategy): void {
        const fileExtension = this.getFileExtension(file.originalname);
        
        if (!strategy.getSupportedExtensions().includes(fileExtension)) {
            throw new BadRequestException(
                `File extension '${fileExtension}' is not supported for this conversion`
            );
        }

        if (file.mimetype && !strategy.getMimeTypes().includes(file.mimetype)) {
            throw new BadRequestException(
                `MIME type '${file.mimetype}' is not supported for this conversion`
            );
        }
    }

    generateOutputFilename(originalName: string, outputExtension: string): string {
        const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
        return `${baseName}.${outputExtension}`;
    }

    private getFileExtension(filename: string): string {
        return filename.split('.').pop()?.toLowerCase() || '';
    }
}
