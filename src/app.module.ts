import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
// import { TelegramService } from './telegram_bot/telegram_bot2';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
