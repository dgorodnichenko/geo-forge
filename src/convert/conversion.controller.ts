import { Controller, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ConversionService } from './conversion.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { sendFileResponse } from './response/response';
import { Response } from 'express';

@Controller('conversion')
export class ConversionController {
    constructor(private readonly conversionService: ConversionService) {}

    @Post('kmz-to-geojson')
    @UseInterceptors(FileInterceptor('file'))
    async convertKmzToGeojson(
        @UploadedFile() file: Express.Multer.File,
        @Res() res: Response,
    ) {
        const result = await this.conversionService.processKmzFileToGeojson(file);
        sendFileResponse(res, result, 'GEOJSON');
    }
}
