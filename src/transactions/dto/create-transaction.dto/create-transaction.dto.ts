// import { TransactionTypeEnum } from "src/transactions/enums/transaction-type.enum.ts/transaction-type.enum";


// const dateCheck = (transactionDate) => {
//     return new Date(transactionDate)
// }

export class CreateTransactionDto {

    amount: number;

    type: string;

    category: string;

    description: String;
    
    transactionDate: string;
}
