import { Module } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../transactions/entities/transaction.entity/transaction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TransactionEntity])
    ],
    providers: [AccountingService]
})
export class AccountingModule { }
