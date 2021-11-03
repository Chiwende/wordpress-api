import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PayModule } from './pay/pay.module';
import { AirtelModule } from './airtel/airtel.module';
import { MtnModule } from './mtn/mtn.module';
import { ZamtelModule } from './zamtel/zamtel.module';
import { SendModule } from './send/send.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airtel_Credentials } from './entities/airtel_credentials';
import { Zamtel_Credentials } from './entities/zamtel_credentials';
import { Mtn_Credentials } from './entities/mtn_credentials';
import { Transactions } from './entities/transactions.entity';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '68.183.108.124',
      port: 3306,
      username: 'chiwende',
      password: '9@$$w0rD',
      database: 'wordpress_payment_gateway',
      entities: [Airtel_Credentials,Zamtel_Credentials, Mtn_Credentials, Transactions],
      synchronize: true,
    }),
    PayModule, 
    AirtelModule, 
    MtnModule, 
    ZamtelModule, 
    SendModule, MessagingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
