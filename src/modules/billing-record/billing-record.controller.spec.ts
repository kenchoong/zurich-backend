import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminAuthJwtGuard } from '../auth/guards/admin.guard';
import { BillingRecordController } from './billing-record.controller';
import { BillingRecordService } from './billing-record.service';
import {
  BillingRecordCreateDto,
  BillingRecordUpdateBodyDto,
} from './dto/billing-record.input';

describe('BillingRecordController', () => {
  let controller: BillingRecordController;
  let service: BillingRecordService;

  const mockService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCommandBus = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingRecordController],
      providers: [
        {
          provide: BillingRecordService,
          useValue: mockService,
        },
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
        {
          provide: JwtService,
          useValue: { verify: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
        AdminAuthJwtGuard,
      ],
    }).compile();

    controller = module.get<BillingRecordController>(BillingRecordController);
    service = module.get<BillingRecordService>(BillingRecordService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all billing records', async () => {
      const mockRecords = [
        {
          id: 1,
          productId: 'PROD1',
          location: 'Location 1',
          premiumPaidAmount: 19.99,
        },
      ];

      mockService.findAll.mockResolvedValue(mockRecords);

      const result = await controller.findAll({});

      expect(result).toBe(mockRecords);
      expect(mockService.findAll).toHaveBeenCalledWith({});
    });

    it('should apply filters when provided', async () => {
      const query = {
        productCode: 'PROD1',
        location: 'Location',
      };

      await controller.findAll(query);

      expect(mockService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('create', () => {
    it('should create a new billing record', async () => {
      const createDto: BillingRecordCreateDto = {
        productId: 'PROD1',
        location: 'Location 1',
        premiumPaidAmount: 19.99,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        photo: 'photo.jpg',
      };

      const mockCreatedRecord = {
        id: 1,
        ...createDto,
      };

      mockService.create.mockResolvedValue(mockCreatedRecord);

      const result = await controller.createBillingRecord(createDto);

      expect(result).toBe(mockCreatedRecord);
      expect(mockService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update an existing billing record', async () => {
      const id = 1;
      const updateDto: BillingRecordUpdateBodyDto = {
        location: 'Updated Location',
        premiumPaidAmount: 29.99,
        email: 'updated@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        photo: 'updated.jpg',
      };

      const mockUpdatedRecord = {
        id,
        ...updateDto,
      };

      mockService.update.mockResolvedValue(mockUpdatedRecord);

      const result = await controller.updateBillingRecord({ id }, updateDto);

      expect(result).toBe(mockUpdatedRecord);
      expect(mockService.update).toHaveBeenCalledWith(id, updateDto);
    });
  });

  describe('delete', () => {
    it('should delete a billing record', async () => {
      const id = 1;
      const mockResponse = { message: 'Billing record deleted successfully' };

      mockService.delete.mockResolvedValue(mockResponse);

      const result = await controller.deleteBillingRecord({ id });

      expect(result).toBe(mockResponse);
      expect(mockService.delete).toHaveBeenCalledWith(id);
    });
  });
});
