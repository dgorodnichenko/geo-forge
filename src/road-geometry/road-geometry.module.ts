import { Module } from '@nestjs/common';
import { RoadGeometryController } from './road-geometry.controller';
import { RoadGeometryService } from './road-geometry.service';

@Module({
    controllers: [RoadGeometryController],
    providers: [RoadGeometryService]
})
export class RoadGeometryModule {}
