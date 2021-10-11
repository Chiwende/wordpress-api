import { IsNotEmpty } from 'class-validator';

export class AirtelRequestDto {
  @IsNotEmpty() client_id: string;
  @IsNotEmpty() client_secret: string;
  @IsNotEmpty() grant_type: string;
  @IsNotEmpty() reference: string;
  @IsNotEmpty() country: string;
  @IsNotEmpty() currency: string;
  @IsNotEmpty() msisdn: string;
  @IsNotEmpty() amount: string;
  @IsNotEmpty() id: string;
}
