import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { MtnAuthenticationDto } from 'src/dto/MtnAuthenticationDto';
import { MtnRequestDto } from 'src/dto/MtnRequestDto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MtnService {
    constructor (
        private readonly httpService: HttpService
    ) {}

    transaction_status: any
    transction_result: any

    async generateToken(payload: MtnAuthenticationDto){
        console.log("authentication payload recieved ====> ", payload)
        const encoded_creds = Buffer.from(payload.user_id + ":" + payload.user_key).toString('base64');
        // console.log("encoded headers",encoded_creds)
        const config = {
            method: 'post',
            url: 'https://proxy.momoapi.mtn.com/collection/token/',
            headers: {
              'Ocp-Apim-Subscription-Key': payload.ocp_apim_subscription_key    ,
              'Authorization': 'Basic '+ encoded_creds
            }
          };
        //   console.log("Headers been sent", config.headers)
          const url = "https://proxy.momoapi.mtn.com/collection/token/"
          const data = ""

        const access = await this.httpService.post(url, data, { headers: config.headers})
            .toPromise()
            .then(res => {
                // console.log(res.headers.)
                const response = res.data
                const access_token = response.access_token
                // console.log("returning this token", access_token)
                return access_token
            })
        return access
    }

    async transctionEnquiry(x_ref: string, access_token: string, sub_key: string){
      console.log("transaction status")
      const config = {
        method: 'get',
        url: 'https://proxy.momoapi.mtn.com/collection/v1_0/requesttopay/'+x_ref,
        headers: {
          'Ocp-Apim-Subscription-Key': sub_key,
          'Authorization': 'Bearer '+ access_token,
          'Content-Type': 'application/json',
          'X-Target-Environment': "mtnzambia",
        }
    };

      const status = await this.httpService.get(config.url, { headers: config.headers})
      .toPromise()
      .then(res => {
          
          // console.log(res.headers)
          console.log(" trasaction enquiry response status ==> ",res.data)
          console.log(" trasaction enquiry response status ==> ",res.data.status)
          const response = res.data
          return response
      })
      return status
    }    

    async sendPaymentRequest(payload: MtnRequestDto){
        const access_token = await this.generateToken(payload)
        console.log("*access token", access_token)
        const x_ref = uuidv4();

        const momoPayload = {
            "amount": payload.amount,
            "currency": payload.currency,
            "externalId": "12345678",
            "payer": {
              "partyIdType": "MSISDN",
              "partyId": payload.partyId
            },
            "payerMessage": "test request",
            "payeeNote": "test request"
        }

        const config = {
            method: 'post',
            url: 'https://proxy.momoapi.mtn.com/collection/v1_0/requesttopay',
            headers: {
              'Ocp-Apim-Subscription-Key': payload.ocp_apim_subscription_key,
              'Authorization': 'Bearer '+ access_token,
              'Content-Type': 'application/json',
              'X-Target-Environment': "mtnzambia",
              'X-Reference-Id': x_ref,
            }
        };

        console.log("request headrers",config.headers)
        console.log(momoPayload)


        

        const payment_request = await this.httpService.post(config.url, momoPayload, { headers: config.headers})
        .toPromise()
        .then(res => {
            // console.log(res.headers)
            console.log("response status ==> ",res.status)
            const response = res.data
            return res.status
        })

        this.transaction_status = await this.transctionEnquiry(x_ref, access_token,payload.ocp_apim_subscription_key);
        while(this.transaction_status.status == "PENDING"){
          console.log('TRANSACTION STATUS ===> ', this.transaction_status.status)
          this.transaction_status = await this.transctionEnquiry(x_ref, access_token,payload.ocp_apim_subscription_key);
        }
        return this.transaction_status.status

    }

    async disbursementRequest(payload: MtnRequestDto){
        const access_token = await this.generateToken(payload)
  
        const momoPayload = {
            "amount": payload.amount,
            "currency": payload.currency,
            "externalId": payload.externalId,
            "payer": {
              "partyIdType": "MSISDN",
              "partyId": payload.partyId
            },
            "payerMessage": payload.payer_message,
            "payeeNote": payload.payer_note
        }
  
        const config = {
            method: 'post',
            url: 'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay',
            headers: {
              'Ocp-Apim-Subscription-Key': payload.ocp_apim_subscription_key    ,
              'Authorization': 'Bearer '+ access_token,
              'Content-Type': 'application/json',
              'X-Target-Environment': payload.target_environment,
              'X-Reference-Id': '2e737a06-13f5-11ec-82a8-0242ac130003',
            }
        };
  
        console.log("momo payload ===>",momoPayload)
        console.log("headers ==> ",config.headers)
  
        const access = await this.httpService.post(config.url, momoPayload, { headers: config.headers})
        .toPromise()
        .then(res => {
            console.log(res.status)
            const response = res.data
            const access_token = response.access_token
            console.log(access_token)
            return access_token
        })
        return access
  
    }
  
}
