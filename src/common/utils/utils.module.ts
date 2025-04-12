import { Module } from '@nestjs/common';
import { GeoUtilsService } from './geo-utils/geo-utils.service';
import { RequestsModule } from '../requests/requests.module';
import { LoggerService } from './logger/logger.service';

@Module({
  imports: [RequestsModule],
  providers: [GeoUtilsService, LoggerService],
  exports: [GeoUtilsService],
})
export class UtilsModule {}
