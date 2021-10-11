import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('airtel')
export class AirtelController {
    @Post('collection')
    makeCollectionRequest(@Body() payload: any){
        return "collection request"
    }

    @Post('disbursement')
    makeDisbursementRequest(@Body() payload: any){
        return "disbursement request"
    }
}
