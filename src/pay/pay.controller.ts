import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentDto } from 'src/dto/PaymentDto';
import { PayService } from './pay.service';

@Controller('pay')
export class PayController {
    constructor (
        private readonly payService: PayService
    ) {}
    @Post()
    makePaymentrequest(@Body() payload: PaymentDto){
        return this.payService.makePaymentRequest(payload)
    }

    @Get("transactions")
    getTransactions(){
        return "transaction list"
    }

    @Get("transaction/:transaction_id")
    fetchTransactionByID(@Param() transaction_id: string){
        return "Transactions by id"
    }

    @Get("transactions/:msisdn")
    fetchTransactionByNumber(@Param() msisdn: string){
        return "transactions by number"
    }

    @Get("transaction/:msisdn/:transactionID")
    fetchTransactionsByNumberandTransactionId(@Param() msisdn: string, @Param() transaction_id: string){}
}
