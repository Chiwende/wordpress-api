import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AirtelService } from './airtel.service';

@Controller('airtel')
export class AirtelController {
    constructor (
        private readonly airtelService: AirtelService
    ) {}
    @Post('collection')
    makeCollectionRequest(@Body() payload: any){
        return "collection request"
    }

    @Post('disbursement')
    makeDisbursementRequest(@Body() payload: any){
        return "disbursement request"
    }

    @Post()
    getTransactionDetails(@Body() payload: any){
        return this.airtelService.transactionsEnquiry(payload)
    }
}
