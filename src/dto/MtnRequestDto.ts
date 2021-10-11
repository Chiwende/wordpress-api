import { IsNotEmpty } from 'class-validator'

export class MtnRequestDto {
  @IsNotEmpty() user_id: string;
  @IsNotEmpty() user_key: string;
  @IsNotEmpty() ocp_apim_subscription_key: string;
  @IsNotEmpty() amount: string;
  @IsNotEmpty() currency: string;
  @IsNotEmpty() partyId: string;
  @IsNotEmpty() payer_message: string;
  @IsNotEmpty() payer_note: string;
  @IsNotEmpty() externalId: string;
  @IsNotEmpty() target_environment: string;
}
