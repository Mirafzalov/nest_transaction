

export class CreateTransactionDto {

    amount: number;

    type: string;

    category: string;

    description: String;
    
    transactionDate: string;
}



export class QueryTransactionDto{
    type?: 'expense' | 'income';
    from?: string;
    to?: string;

}
