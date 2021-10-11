import { Module } from '@nestjs/common';
import { ZamtelService } from './zamtel.service';
import { ZamtelController } from './zamtel.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [ZamtelService],
  controllers: [ZamtelController],
  imports: [
    HttpModule.register({
      timeout: 100000,
      maxRedirects: 5,
    })
  ]
})
export class ZamtelModule {}
