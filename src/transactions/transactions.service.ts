import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionEntity } from './entities/transaction.entity/transaction.entity';
import { Repository, Transaction } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';



@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(TransactionEntity)
        private transactionRepository: Repository<TransactionEntity>,
    ) { }

    async findAll(): Promise<TransactionEntity[]> {
        const transaction = this.transactionRepository.find()
        return transaction
    }

    async create(data): Promise<TransactionEntity[]> {
        // let date = new Date(data.transactionDate)
        // data.transactionDate = date
        console.log(data)
        return await this.transactionRepository.save(data)

    }

    async findOne(id): Promise<TransactionEntity | null> {
        const transaction = await this.transactionRepository.findOneBy({ id })
        if (!transaction) {
            throw new NotFoundException(`Transasctions with id =${id} is not found`)
        }

        return transaction
    }

    async delete(id): Promise<TransactionEntity[]> {
        const transaction = await this.transactionRepository.findOneBy({ id })
        if (!transaction) {
            throw new NotFoundException(`Transasctions with id ${id} is not found`)
        }
        await this.transactionRepository.delete(id)

        return this.transactionRepository.find()
    }

    async update(id, data): Promise<TransactionEntity> {
        const transaction = await this.transactionRepository.preload({ id, ...data })

        if (!transaction) {
            throw new NotFoundException(`Transasctions with id ${id} is not found`)
        }

        return this.transactionRepository.save(transaction)

    }

    async filterBy(data): Promise<TransactionEntity[]> {
        const transaction = await this.transactionRepository.find()

        const result = transaction.filter(transac => 
            (!data.type || transac.type === data.type) && 
            (!data.from || transac.transactionDate >= data.from && new Date(data.from)) && 
            (!data.to || transac.transactionDate <= data.to && new Date(data.to)))

        if (result.length < 1){
            throw new NotFoundException('No transactions found')
        }
        return result
    }

}
