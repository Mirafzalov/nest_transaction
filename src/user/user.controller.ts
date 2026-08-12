import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/user.dto';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Post()
    create(@Body() data: CreateUserDto) {
        return this.userService.create(data)
    }

    @Get()
    findAll() {
        return this.userService.findAll()
    }
}
