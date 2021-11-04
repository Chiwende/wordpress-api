import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { SMS } from 'src/entities/SendSMS.entity';

@Injectable()
export class MessagingService {
    constructor (
        private readonly httpService: HttpService
    ) {}

    async sendTextMessage(payload: SMS){
        console.log("Send SMS PAyload", payload)
        const url = 'http://137.184.139.186:8080/sms';
        return await this.httpService
          .post(url, payload)
          .toPromise()
          .then((res) => {
            console.log("send SMS response header", res.headers)
            console.log('Send SMS Response',res.data)
            
          });
    }
}
