import { Module } from '@nestjs/common';
import { GeoUtilsService } from './geo-utils/geo-utils.service';
import { RequestsModule } from '../requests/requests.module';

@Module({
  imports: [RequestsModule],
  providers: [GeoUtilsService],
  exports: [GeoUtilsService],
})
export class UtilsModule {}
