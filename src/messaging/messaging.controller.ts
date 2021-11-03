import { Body, Controller, Post } from '@nestjs/common';
import { SMS } from 'src/entities/SendSMS.entity';
import { MessagingService } from './messaging.service';

@Controller('messaging')
export class MessagingController {
    constructor (
        private readonly messagingService: MessagingService
    ) {}

    @Post('sms')
    SendMessage(@Body() payload: SMS){
        return this.messagingService.sendTextMessage(payload)
    }
}
