import { Test, TestingModule } from '@nestjs/testing';
import { StakedService } from './staked.service';

describe('StakedService', () => {
  let service: StakedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StakedService],
    }).compile();

    service = module.get<StakedService>(StakedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
