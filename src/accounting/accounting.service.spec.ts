import { Test, TestingModule } from '@nestjs/testing';
import { AccountingService } from './accounting.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionEntity } from '../transactions/entities/transaction.entity/transaction.entity';

describe('AccountingService', () => {
  let service: AccountingService;

  const mockTransactionRepository = {
    find: jest.fn().mockReturnValue([{type:'expense',amount:1000}]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [
        AccountingService,
        {
          provide: getRepositoryToken(TransactionEntity),
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<AccountingService>(AccountingService);
  });

  it('should be defined', async() => {
    console.log(await service.calculate());
    
    expect(service).toBeDefined();
  });
});
