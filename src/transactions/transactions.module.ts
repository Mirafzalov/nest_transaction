import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity/transaction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TransactionEntity]),
    ],
    controllers: [TransactionsController],
    providers: [TransactionsService]
})


export class TransactionsModule { }


