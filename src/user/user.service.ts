import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async create(data: CreateUserDto) {
        const newData =  this.userRepository.create(data)
        return await this.userRepository.save(newData)

    }

    async findAll() {
        return await this.userRepository.find()
    }
}
