import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { QuadkeyOptions, QuadkeysService } from './quadkeys.service';

@Controller('quadkeys')
export class QuadkeysController {
    constructor(private readonly quadkeyService: QuadkeysService) {}

    @Post('generate')
    async generateQuadkeys(@Body() options: QuadkeyOptions) {
        try {
            const result = await this.quadkeyService.generateQuadkeys(options);
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            throw new HttpException(
            {
                success: false,
                message: error.message,
            },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('generate')
    async generateQuadkeysGet(
        @Query('city') city: string,
        @Query('zoom') zoom?: string,
    ) {
        if (!city) {
            throw new HttpException(
            {
                success: false,
                message: 'City parameter is required',
            },
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            const result = await this.quadkeyService.generateQuadkeys({
                city,
                zoom: zoom ? parseInt(zoom, 10) : 14,
            });
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            throw new HttpException(
            {
                success: false,
                message: error.message,
            },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
