import { Module } from '@nestjs/common';
import { ConversionModule } from './convert/conversion.module';
import { FileSystemService } from './convert/file-system/file-system.service';
import { FileValidationService } from './convert/file-validation/file-validation.service';
import { RoadGeometryService } from './road-geometry/road-geometry.service';
import { RoadGeometryModule } from './road-geometry/road-geometry.module';
import { QuadkeysController } from './quadkeys/quadkeys.controller';
import { QuadkeysService } from './quadkeys/quadkeys.service';
import { QuadkeysModule } from './quadkeys/quadkeys.module';

@Module({
  imports: [ConversionModule, RoadGeometryModule, QuadkeysModule],
  providers: [FileSystemService, FileValidationService, RoadGeometryService, QuadkeysService],
})
export class AppModule {}
