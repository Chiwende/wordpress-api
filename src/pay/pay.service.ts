import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { AirtelService } from 'src/airtel/airtel.service';
import { AirtelRequestDto } from 'src/dto/AirtelRequestDto';
import { AirtelResponseDto } from 'src/dto/AirtelResponseDto';
import { MtnRequestDto } from 'src/dto/MtnRequestDto';
import { PaymentDto } from 'src/dto/PaymentDto';
import { ZamtelRequestDto } from 'src/dto/ZamtelRequestDto';
import { Airtel_Credentials } from 'src/entities/airtel_credentials';
import { Mtn_Credentials } from 'src/entities/mtn_credentials';
import { Transactions } from 'src/entities/transactions.entity';
import { Zamtel_Credentials } from 'src/entities/zamtel_credentials';
import { MtnService } from 'src/mtn/mtn.service';
import { ZamtelService } from 'src/zamtel/zamtel.service';
import { Repository } from 'typeorm';

@Injectable()
export class PayService {
    constructor (
        @InjectRepository(Airtel_Credentials)
        private readonly airtel_credentials_repository: Repository<Airtel_Credentials>,
        @InjectRepository(Mtn_Credentials)
        private readonly mtn_credentials_repository: Repository<Mtn_Credentials>,
        @InjectRepository(Zamtel_Credentials)
        private readonly zamtel_credentials_repository: Repository<Zamtel_Credentials>,
        @InjectRepository(Transactions)
        private readonly transactions_repository: Repository<Transactions>,

        private readonly airtelService: AirtelService,
        private readonly mtnService: MtnService,
        private readonly zamtelService: ZamtelService
    ) {}

    async makePaymentRequest(payload: PaymentDto){
        payload.transaction_id = "KH"+ "-" + Date.now()
        
        this.writeTransaction(payload)
        const number_prefix = payload.msisdn.slice(4,5)
        console.log(number_prefix)
        if(number_prefix == "7" ){
            const provider = "airtel"
            const user_id = payload.user_id
            const  api_creds = await this.fetchUserDetails(provider, user_id)
            console.log(api_creds)
            const request_payload: AirtelRequestDto = {
                client_id: api_creds[0].client_id,
                client_secret: api_creds[0].secret_key,
                grant_type: "client_credentials",
                reference: payload.reference,
                country: "ZM",
                currency: "ZMW",
                msisdn: payload.msisdn,
                amount: payload.amount,
                id: payload.transaction_id
            }
            const mno_response = await this.airtelService.requestPayment(request_payload)

            if(mno_response.data.transaction.status == 'TS' ){
                return {
                    "response_code": mno_response.status.code,
                    "message": mno_response.status.message
                }
            } else if(mno_response.data.transaction.status == 'TF'){
                return {
                    "response_code": mno_response.status.code,
                    "message": mno_response.status.message
                }
            } else {
                return {
                    "response_code": "500",
                    "message": "Request timed out please try again"
                }
            }

        } else if (number_prefix == "6"){
            const provider = "mtn"
            const user_id = payload.user_id
            const api_creds = await this.fetchUserDetails(provider, user_id)
            console.log("api creds fetched", api_creds)
            // amount: payload.amount,
            const request_payload: MtnRequestDto = {
                ocp_apim_subscription_key: api_creds[0].primary_key,
                user_id: api_creds[0].mtn_user_id,
                user_key: api_creds[0].mtn_key,
                amount: "1",
                currency: "ZMW",
                partyId: payload.msisdn,
                payer_message: payload.reference,
                payer_note: payload.reference,
                externalId: payload.reference,
                target_environment: "mtnzambia"
            }
            const mno_response = await this.mtnService.sendPaymentRequest(request_payload)
            console.log(mno_response)
            if(mno_response == 202){
                const update_transaction_payload = {
                    "status": 200,
                    "message": "Success"
                } 
                this.updateTransaction(update_transaction_payload)
                return {
                    response_code: 200,
                    message: "Transaction accepted for processing"
                }
            } else {
                const update_transaction_payload = {
                    "status": mno_response,
                    "message": "Failed"
                } 
                this.updateTransaction(update_transaction_payload)
                return {
                    response_code: mno_response,
                    message: "Transaction Failed"
                }
            }

        } else if(number_prefix == "5"){
            const reference = "KH"+ "-" + Date.now()
            const provider = "zamtel"
            const user_id = payload.user_id
            const api_creds = await this.fetchUserDetails(provider, user_id)
            console.log("api creds fetch for zamtel transaction", api_creds)
            const request_payload:ZamtelRequestDto = {
                third_party_id: api_creds[0].third_party_id,
                password: api_creds[0].password,
                amount: payload.amount,
                shortCode: api_creds[0].shortCode,
                conversationI_id: reference,
                msisdn: payload.msisdn
            }
            const mno_response = await this.zamtelService.collectionRequest(request_payload)
            console.log(mno_response)
            console.log('response code ??', mno_response.status)
            if(mno_response.status == '0'){
               const update_transaction_payload = {
                   "status": 200,
                   "message": mno_response.message
               } 
               this.updateTransaction(update_transaction_payload)
               return {
                   response_code: "200",
                   message: mno_response.message
               }
            } else {
                const update_transaction_payload = {
                    "status": 500,
                    "message": mno_response.message
                } 
                const update = this.updateTransaction(update_transaction_payload)
                const response = {
                    response_code: mno_response.status,
                    message: mno_response.message
                }

                return response
            }
    

        }

    }

    async fetchUserDetails(provider: string, user_id: number): Promise<any> {
        if(provider == "airtel"){
            return await this.airtel_credentials_repository.find({
                where: {
                    user_id: user_id
                }
            })
        } else if (provider == "mtn"){
            return await this.mtn_credentials_repository.find({
                where: {
                    user_id: user_id
                }
            })
        } else if (provider == "zamtel"){
            console.log("user id ",user_id)
            return await this.zamtel_credentials_repository.find({
                where: {
                    user_id: user_id
                }
            })

        } 
    }

    writeTransaction(payload: PaymentDto){
        this.transactions_repository.save(payload)
    }

    updateTransaction(payload){
        console.log("Update Transaction ===> ", payload)
        this.transactions_repository.query(
            "UPDATE transactions set status = "+ payload.status + ", updated_at = now() WHERE transaction_id = '"+ payload.transaction_id +"'")
    }
}
