import { Module } from '@nestjs/common';
import { PayService } from './pay.service';
import { PayController } from './pay.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airtel_Credentials } from 'src/entities/airtel_credentials';
import { AirtelService } from 'src/airtel/airtel.service';
import { HttpModule } from '@nestjs/axios';
import { MtnService } from 'src/mtn/mtn.service';
import { Mtn_Credentials } from 'src/entities/mtn_credentials';
import { Zamtel_Credentials } from 'src/entities/zamtel_credentials';
import { ZamtelService } from 'src/zamtel/zamtel.service';
import { Transactions } from 'src/entities/transactions.entity';
import { MessagingService } from 'src/messaging/messaging.service';

@Module({
  providers: [PayService, AirtelService, MtnService, ZamtelService, MessagingService],  
  controllers: [PayController],
  imports: [
    TypeOrmModule.forFeature([
      Airtel_Credentials,
      Mtn_Credentials,
      Zamtel_Credentials,
      Transactions
    ]),
    HttpModule.register({
      timeout: 100000,
      maxRedirects: 5,
    })
  ]
})
export class PayModule {}
