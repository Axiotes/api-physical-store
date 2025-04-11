import { Module } from '@nestjs/common';
import { GoogleApisService } from './google-apis/google-apis.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [GoogleApisService],
})
export class RequestsModule {}
