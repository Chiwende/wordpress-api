import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AirtelRequestDto } from 'src/dto/AirtelRequestDto';
import { AirtelAuthenticationDto } from 'src/dto/AirtelTokenPayload';

@Injectable()
export class AirtelService {
    constructor (
        private readonly httpService: HttpService
    ) {}
    async generateToken(payload: AirtelAuthenticationDto){
        console.log("Generate  token payload", payload)
        const url = 'https://openapiuat.airtel.africa/auth/oauth2/token';
        return await this.httpService
          .post(url, payload)
          .toPromise()
          .then((res) => {
            // console.log('generate token response headers',res.headers)
            console.log('generate token response body',res.data)
            return res.data.access_token;
          });
    }

    async requestPayment(payload: AirtelRequestDto) {
        const reference = "KH" +"" +Date.now()
        const access_token = await this.generateToken(payload);
        console.log(' airtel access token',access_token)
        const openapi_request = {
          reference: reference,
          subscriber: {
            country: payload.country,
            currency: payload.currency,
            msisdn: payload.msisdn.slice(3),
          },
          transaction: {
            amount: payload.amount,
            country: payload.country,
            currency: payload.currency,
            id: reference,
          },
        };
    
        const config = {
          method: 'post',
          url: 'https://openapiuat.airtel.africa/merchant/v1/payments/',
          headers: {
            Accept: '*/*',
            Authorization: 'Bearer ' + access_token,
            'Content-Type': 'application/json',
            'X-Country': payload.country,
            'X-Currency': payload.currency,
          },
        };
    
        const request = await this.httpService
          .post(config.url, openapi_request, {
            headers: config.headers,
          })
          .toPromise()
          .then((res) => {
            console.log(res.data);
            return res.data;
          });
      }
      

      async requestDisbursement(payload: AirtelRequestDto) {
        const reference = "KH" +"" +Date.now()
        const access_token = this.generateToken(payload);
        const openapi_request = {
          reference: payload.reference,
          subscriber: {
            country: payload.country,
            currency: payload.currency,
            msisdn: payload.msisdn.slice(3),
          },
          transaction: {
            amount: payload.amount,
            country: payload.country,
            currency: payload.currency,
            id: payload.id,
          },
        };
    
        const config = {
          method: 'post',
          url: 'https://openapiuat.airtel.africa/merchant/v1/payments/',
          headers: {
            Accept: '*/*',
            Authorization: 'Bearer ' + access_token,
            'Content-Type': 'application/json',
            'X-Country': 'ZM',
            'X-Currency': 'ZMW',
          },
        };
    
        const request = await this.httpService
          .post(config.url, openapi_request, {
            headers: config.headers,
          })
          .toPromise()
          .then((res) => {
            console.log(res.data);
            return res.data;
          });
      }
    
}
