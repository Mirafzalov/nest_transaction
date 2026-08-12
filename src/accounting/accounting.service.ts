import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '../transactions/entities/transaction.entity/transaction.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AccountingService {
    constructor(
        @InjectRepository(TransactionEntity)
        private transactionRepository: Repository<TransactionEntity>
    ) { }

    async calculate(): Promise<{ message: string; total: number }> {

        const transaction = await this.transactionRepository.find()
        const expenses = transaction.reduce((expense, transac) => transac.type == 'expense' ? transac.amount + expense : expense + 0, 0)
        const incomes = transaction.reduce((income, transac) => transac.type == 'income' ? transac.amount + income : income + 0, 0)
        const total = incomes - expenses

        if (total > 0) {
            return {
                message: `You have ${total} sum left`,
                total,
            };
        } else if (total < 0) {
            return {
                message: `Your expenses exceeded your income, accounting for ${total} sum`,
                total,
            };

        } else {
            throw new NotFoundException('Sth went wrong')
        }


    }

}