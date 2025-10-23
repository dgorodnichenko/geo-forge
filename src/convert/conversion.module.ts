import { Module, ValidationPipe } from '@nestjs/common';
import { ConversionController } from './conversion.controller';
import { ConversionService } from './conversion.service';
import { APP_PIPE } from '@nestjs/core';
import { KmzToGeojsonStrategy } from './strategies/kmz-to-geojson.strategy';
import { ConversionStrategyRegistry } from './registry/conversion-strategy-registry';
import { FileSystemService } from 'src/convert/file-system/file-system.service';
import { FileValidationService } from 'src/convert/file-validation/file-validation.service';

@Module({
    controllers: [ConversionController],
    providers: [
        ConversionService,
        ConversionStrategyRegistry,
        KmzToGeojsonStrategy,
        FileSystemService,
        FileValidationService,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe
        }
    ]
})
export class ConversionModule {}
