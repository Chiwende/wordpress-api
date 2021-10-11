/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';
export class AirtelAuthenticationDto {
  @IsNotEmpty() client_id: string;
  @IsNotEmpty() client_secret: string;
  @IsNotEmpty() grant_type: string;
}
