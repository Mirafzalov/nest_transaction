import { Module } from '@nestjs/common';
import { AccountingController, TransactionsController } from './transactions.controller';
import { AccountingService, TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity/transaction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TransactionEntity]),
    ],
    controllers: [TransactionsController, AccountingController],
    providers: [TransactionsService, AccountingService]
})


export class TransactionsModule { }


