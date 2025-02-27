import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryService } from '@ptc-org/nestjs-query-core';
import { Repository } from 'typeorm';
import { BillingRecordService } from './billing-record.service';
import { BillingRecordEntity } from './billing-record.entity';
import { NotFoundException } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';

describe('BillingRecordService', () => {
  let service: BillingRecordService;
  let repository: Repository<BillingRecordEntity>;
  let queryService: QueryService<BillingRecordEntity>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockQueryService = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingRecordService,
        {
          provide: getRepositoryToken(BillingRecordEntity),
          useValue: mockRepository,
        },
        {
          provide: 'BillingRecordEntityQueryService',
          useValue: mockQueryService,
        },
        {
          provide: QueryBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<BillingRecordService>(BillingRecordService);
    repository = module.get<Repository<BillingRecordEntity>>(
      getRepositoryToken(BillingRecordEntity),
    );
    queryService = module.get<QueryService<BillingRecordEntity>>(
      'BillingRecordEntityQueryService',
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all records with converted premiumPaidAmount', async () => {
      const mockRecords = [
        {
          id: 1,
          productId: 'PROD1',
          location: 'Location 1',
          premiumPaidAmount: 1999,
          email: 'test1@example.com',
        },
        {
          id: 2,
          productId: 'PROD2',
          location: 'Location 2',
          premiumPaidAmount: 2999,
          email: 'test2@example.com',
        },
      ];

      mockQueryService.query.mockResolvedValue(mockRecords);

      const result = await service.findAll({});

      expect(result).toEqual(
        mockRecords.map((record) => ({
          ...record,
          premiumPaidAmount: record.premiumPaidAmount / 100,
        })),
      );
      expect(mockQueryService.query).toHaveBeenCalledWith({
        filter: {},
      });
    });

    it('should apply filters correctly', async () => {
      await service.findAll({
        productCode: 'PROD1',
        location: 'Location',
      });

      expect(mockQueryService.query).toHaveBeenCalledWith({
        filter: {
          and: [
            {
              productId: { eq: 'PROD1' },
              location: { iLike: '%Location%' },
            },
          ],
        },
      });
    });
  });

  describe('create', () => {
    it('should create a new record with converted premiumPaidAmount', async () => {
      const createDto = {
        productId: 'PROD1',
        location: 'Location 1',
        premiumPaidAmount: 19.99,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        photo: 'photo.jpg',
      };

      const expectedEntity = {
        ...createDto,
        premiumPaidAmount: 1999, // 19.99 * 100
      };

      mockRepository.create.mockReturnValue(expectedEntity);
      mockRepository.save.mockResolvedValue(expectedEntity);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(expectedEntity);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedEntity);
      expect(result).toEqual(expectedEntity);
    });
  });

  describe('update', () => {
    it('should update an existing record with converted premiumPaidAmount', async () => {
      const id = 1;
      const updateDto = {
        location: 'Updated Location',
        premiumPaidAmount: 29.99,
        email: 'updated@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        photo: 'updated.jpg',
      };

      const existingRecord = {
        id,
        productId: 'PROD1',
        ...updateDto,
        premiumPaidAmount: 2999, // 29.99 * 100
      };

      mockRepository.findOne.mockResolvedValue(existingRecord);
      mockRepository.save.mockResolvedValue(existingRecord);

      const result = await service.update(id, updateDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(existingRecord);
      expect(result).toEqual(existingRecord);
    });

    it('should throw NotFoundException when record not found', async () => {
      const id = 999;
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(id, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing record', async () => {
      const id = 1;
      const existingRecord = {
        id,
        productId: 'PROD1',
        location: 'Location 1',
        premiumPaidAmount: 1999,
        email: 'test@example.com',
      };

      mockRepository.findOne.mockResolvedValue(existingRecord);

      const result = await service.delete(id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(existingRecord);
      expect(result).toEqual({
        message: 'Billing record deleted successfully',
      });
    });

    it('should throw NotFoundException when record not found', async () => {
      const id = 999;
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(id)).rejects.toThrow(NotFoundException);
    });
  });
});
