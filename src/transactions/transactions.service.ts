import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionEntity } from './entities/transaction.entity/transaction.entity';
import { Repository, Transaction } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';



@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(TransactionEntity)
        private transactionRepository: Repository<TransactionEntity>,
    ) {}

    async findAll(): Promise<TransactionEntity[]> {
        const transaction =  this.transactionRepository.find()
        return transaction
    }

    async create(data): Promise<TransactionEntity[]>{
        const transaction = this.transactionRepository.save(data)
        return transaction
    }

    async findOne(id): Promise<TransactionEntity | null>{
        const transaction = await this.transactionRepository.findOneBy({ id })
        if (!transaction){
            throw new NotFoundException(`Transasctions with id ${id} is not found`)
        }
        return transaction
    }

    async delete(id): Promise<TransactionEntity[]> {
        const transaction = await this.transactionRepository.findOneBy({ id })
        if (!transaction){
            throw new NotFoundException(`Transasctions with id ${id} is not found`)
        }
        await this.transactionRepository.delete(id)

        return this.transactionRepository.find()
    }
    
}
