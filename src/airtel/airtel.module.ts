import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AirtelController } from './airtel.controller';
import { AirtelService } from './airtel.service';

@Module({
  controllers: [AirtelController],
  providers: [AirtelService],
  imports: [
    HttpModule.register({
      timeout: 100000,
      maxRedirects: 5,
    })
  ]
})
export class AirtelModule {}
