import { Module } from '@nestjs/common';
import { QuadkeysController } from './quadkeys.controller';
import { QuadkeysService } from './quadkeys.service';

@Module({
    controllers: [QuadkeysController],
    providers: [QuadkeysService],
    exports: [QuadkeysService],
})
export class QuadkeysModule {}
