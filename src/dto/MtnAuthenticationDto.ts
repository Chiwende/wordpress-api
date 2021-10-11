import { IsNotEmpty } from 'class-validator'

export class MtnAuthenticationDto {
  @IsNotEmpty() user_id: string;
  @IsNotEmpty() user_key: string;
  @IsNotEmpty() ocp_apim_subscription_key: string;
}