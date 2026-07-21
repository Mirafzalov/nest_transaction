import { Controller, Get, Post, Body, Param, ParseIntPipe, Delete, BadRequestException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto/create-transaction.dto';
import { error } from 'console';



@Controller('transactions')
export class TransactionsController {
    constructor(private transactionService: TransactionsService) { }

    @Get()
    findAll() {
        return this.transactionService.findAll()
    }

    @Post()
    create(@Body() data: CreateTransactionDto){

        const date = new Date(data.transactionDate)
        if (!date.getDate()){
            throw new BadRequestException("Invalid date, it should be inserted like '2026-06-06'") 
            
        }
        let d = Date.now()
        console.log(d)


        if (data.type != 'income' && data.type != 'expense'){
            throw new BadRequestException("Invalid type, it shoud be either 'income' or 'expense'") 
        }


        
        return this.transactionService.create(data)
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.transactionService.findOne(id)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.transactionService.delete(id)
    }


}
