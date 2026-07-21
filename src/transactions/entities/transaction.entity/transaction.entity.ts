// import { TransactionTypeEnum } from "src/transactions/enums/transaction-type.enum.ts/transaction-type.enum";
import { text } from "stream/consumers";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";




@Entity()
export class TransactionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @Column({type: 'text'})
    type: string; // expense || income

    @Column()
    category: string;

    @Column({
        type: 'text',
        nullable: true
    })
    description: String;

    @Column({type: 'date'})
    transactionDate: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedDate: Date;

}