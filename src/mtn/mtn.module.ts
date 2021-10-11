import { Module } from '@nestjs/common';
import { MtnService } from './mtn.service';
import { MtnController } from './mtn.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [MtnService],
  imports: [HttpModule.register({
    timeout: 100000,
    maxRedirects: 5,
  })],
  controllers: [MtnController]
})
export class MtnModule {}
