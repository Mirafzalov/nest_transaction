import { Controller, Get, Post, Body, Param, ParseIntPipe, Delete, BadRequestException, Put, Patch, Query } from '@nestjs/common';
import { AccountingService, TransactionsService } from './transactions.service';
import { CreateTransactionDto, QueryTransactionDto } from './dto/create-transaction.dto/create-transaction.dto';



@Controller('transactions')
export class TransactionsController {
    constructor(private transactionService: TransactionsService) { }

    @Get('all')
    findAll() {
        // return this.transactionService.findAll()
    }

    @Post()
    create(@Body() data: CreateTransactionDto) {
        
        const date = new Date(data.transactionDate)
        if (!date.getDate()) {
            throw new BadRequestException("Invalid date, it should be inserted like '2026-06-06'")
        }

        if (data.type != 'income' && data.type != 'expense') {
            throw new BadRequestException("Invalid type, it shoud be either 'income' or 'expense'")
        }



        return this.transactionService.create(data)
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.transactionService.findOne(id)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.transactionService.delete(id)
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: CreateTransactionDto
    ) {

        const date = new Date(data.transactionDate)
        if (data.transactionDate && !date.getDate()) {
            throw new BadRequestException("Invalid date, it should be inserted like '2026-06-06'")
        }

        if (data.type && data.type != 'expense' && data.type != 'income') {
            throw new BadRequestException("Invalid type, it shoud be either 'income' or 'expense'")
        }

        return this.transactionService.update(id, data)
    }   


    @Get()
    filterBy(@Query() data: QueryTransactionDto) {
        return this.transactionService.filterBy(data)
    }

    

}


// @Controller('accounting')
// export class AccountingController{
//     constructor(private accountingService: AccountingService){}

//     @Get()
//     calculate(){
//         return this.accountingService.calculate()
//     }

// }