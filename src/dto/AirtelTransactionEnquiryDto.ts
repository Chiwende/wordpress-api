export class AirtelTransactionEnquiryResponseDto {
    data: Data
    status: Status
}

class Data{
    transaction : Transaction
}

class Transaction {
    code: string
    airtel_money_id: string
    id: string
    message: Text
    status: string
}

class Status{
    code: number
    success: Boolean
    result_code: string
    message: string
}