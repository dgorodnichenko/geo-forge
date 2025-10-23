import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { RoadGeometryService } from './road-geometry.service';
import { RoadGeometryDto } from './dto/RoadGeometryDto';

@Controller('road-geometry')
export class RoadGeometryController {
    constructor(private readonly roadGeometryService: RoadGeometryService) {}

    @Post('calculate')
    async getRoadPoints(@Body() dto: RoadGeometryDto) {
        try {
                const points = await this.roadGeometryService.getRoadPoints(
                    dto.startLat,
                    dto.startLng,
                    dto.endLat,
                    dto.endLng
                );

                if (!points) {
                    throw new HttpException(
                        'No path found between the given points',
                        HttpStatus.NOT_FOUND
                    );
                }

                return {
                    success: true,
                    data: points,
                    count: points.length
                };
            } catch (error) {
                if (error instanceof HttpException) {
                    throw error;
                }
                throw new HttpException(
                    'Failed to calculate road points',
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
        }
    }
}
