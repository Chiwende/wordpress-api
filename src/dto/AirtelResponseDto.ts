import { IsNotEmpty } from 'class-validator';

export class AirtelResponseDto {
    data : AirteResponseData
    status: AirtelResponseStatus
}

class AirteResponseData {
    transaction: TransactionDetails
}

class TransactionDetails {
    id: string
    status: string
}

class AirtelResponseStatus {
    code: number
    success: string
    result_code: string
    message: string
}
