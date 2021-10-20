import { HttpService } from '@nestjs/axios';
import {  Injectable } from '@nestjs/common';
import { ZamtelRequestDto } from 'src/dto/ZamtelRequestDto';
import { ZamtelResponseDto } from 'src/dto/ZamtelResponseDto';

@Injectable()
export class ZamtelService {
    constructor (
        private readonly httpService: HttpService
    ) {}

    async collectionRequest(payload: ZamtelRequestDto):Promise<ZamtelResponseDto> {
        const url =
          'https://apps.zamtel.co.zm/ZampayRest/Req?&ThirdPartyID=' +
          payload.third_party_id +
          '&Password=' +
          payload.password +
          '&Amount=' +
          payload.amount +
          '&Msisdn=' +
          payload.msisdn +
          '&Shortcode=' +
          payload.shortcode +
          '&ConversationId=' +
          payload.conversationI_id;
          console.log(url)
        return await this.httpService
          .get(url)
          .toPromise()
          .then((res) => {
            console.log(res.data);
            console.log(res.status)
            const mno_response = {
              "response_code": res.status,
              "message": res.data.message,
              "data": res.data
            }
            return res.data
          });
      }
    
}
