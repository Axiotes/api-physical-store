import { Module } from '@nestjs/common';
import { GeoUtilsService } from './geo-utils/geo-utils.service';
import { RequestsModule } from '../requests/requests.module';
import { LoggerService } from './logger/logger.service';
import { LogisticUtilsService } from './logistic-utils/logistic-utils.service';

@Module({
  imports: [RequestsModule],
  providers: [GeoUtilsService, LoggerService, LogisticUtilsService],
  exports: [GeoUtilsService, LoggerService, LogisticUtilsService],
})
export class UtilsModule {}
