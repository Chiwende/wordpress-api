import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MessagingController } from './messaging.controller';
import { MessagingService } from './messaging.service';

@Module({
  controllers: [MessagingController],
  providers: [MessagingService],
  imports: [HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
  }),]
})
export class MessagingModule {}
