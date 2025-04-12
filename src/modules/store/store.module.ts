import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { RequestsModule } from 'src/common/requests/requests.module';
import { UtilsModule } from 'src/common/utils/utils.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), RequestsModule, UtilsModule],
  providers: [StoreService],
  controllers: [StoreController]
})
export class StoreModule {}
