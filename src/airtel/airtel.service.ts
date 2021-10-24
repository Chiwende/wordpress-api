import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { response } from 'express';
import { AirtelRequestDto } from 'src/dto/AirtelRequestDto';
import { AirtelResponseDto } from 'src/dto/AirtelResponseDto';
import { AirtelAuthenticationDto } from 'src/dto/AirtelTokenPayload';
import { AirtelTransactionEnquiryResponseDto } from 'src/dto/AirtelTransactionEnquiryDto';

@Injectable()
export class AirtelService {
    constructor (
        private readonly httpService: HttpService
    ) {}

    request_status: any

    async generateToken(payload: AirtelAuthenticationDto):Promise<AirtelResponseDto>{
        console.log("Generate  token payload", payload)
        const url = 'https://openapi.airtel.africa/auth/oauth2/token';
        return await this.httpService
          .post(url, payload)
          .toPromise()
          .then((res) => {
            // console.log('generate token response headers',res.headers)
            console.log('generate token response body',res.data)
            return res.data.access_token;
          });
    }

    async transactionsEnquiry(payload: AirtelRequestDto): Promise<AirtelTransactionEnquiryResponseDto>{
      console.log("<===== check status =====>")
      const access_token = await this.generateToken(payload);
      console.log('access token ====> ' + access_token)
      const config = {
        method: 'get',
        url: ' https://openapi.airtel.africa/standard/v1/payments/' + payload.id,
        headers: {
          Accept: '*/*',
          Authorization: 'Bearer ' + access_token,
          'Content-Type': 'application/json',
          'X-Country': "ZM",
          'X-Currency': "ZMW",
        },
      };

      let request = await this.httpService.get(config.url,{headers: config.headers,})
      .toPromise()
      .then(
        (res) => {
          // console.log(res)
          return res.data
        }
      ).catch(
        (error) => {
          console.log(error)
        }
      )

      var date = new Date();
      let timestamp = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())

      this.request_status = request.data.transaction.status
      while(this.request_status == 'TIP'){
        console.log(timestamp + ' | status ====>' + request.data.transaction.status)
        const result = await this.httpService.get(config.url,{headers: config.headers})
          .toPromise()
          .then(
            (res) => {
              console.log('Transaction enquiry response ',res.data)
              return res.data
            }
          ).catch((error) => {
            console.log('Error getting transaction details =====> ' + error)
          })
        
          this.request_status = result.data.transaction.status
      }
      console.log('data been returned' + request)
      return request
    }



    async requestPayment(payload: AirtelRequestDto): Promise<AirtelTransactionEnquiryResponseDto> {
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
            id: payload.id,
          },
        };
    
        console.log("sending payload below", openapi_request)

        const config = {
          method: 'post',
          url: 'https://openapi.airtel.africa/merchant/v1/payments/',
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

          const check_status = await this.transactionsEnquiry(payload)
          console.log('check status response')

          return check_status
      }
      

      async requestDisbursement(payload: AirtelRequestDto) {
        
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
          url: 'https://openapi.airtel.africa/merchant/v1/payments/',
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
