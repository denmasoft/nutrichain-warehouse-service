import { WarehouseService } from '../../src/services/warehouse.service';
import { Stock } from '../../src/entities/stock.entity';
import { Movement } from '../../src/entities/movement.entity';
import { AppDataSource } from '../../src/config/database';
import { I18n } from 'i18next';

jest.mock('../../src/config/database', () => ({
    AppDataSource: {
        getRepository: jest.fn().mockReturnThis(),
        manager: {
            transaction: jest.fn(),
        },
    },
}));

const mockI18n = {
    t: jest.fn((key, options) => `${key} (productId: ${options?.productId})`),
} as unknown as I18n;

describe('WarehouseService', () => {
    let service: WarehouseService;
    let mockStockRepository: any;
    let mockMovementRepository: any;
    let mockEntityManager: any;

    beforeEach(() => {
        mockStockRepository = {
            findOneBy: jest.fn(),
        };
        mockMovementRepository = {
        };
        mockEntityManager = {
            findOne: jest.fn(),
            create: jest.fn((entity, data) => ({ ...data })),
            save: jest.fn(entity => Promise.resolve(entity)),
        };

        (AppDataSource.manager.transaction as jest.Mock).mockImplementation(async (cb) => {
            return cb(mockEntityManager);
        });
        
        (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
            if (entity === Stock) return mockStockRepository;
            if (entity === Movement) return mockMovementRepository;
        });

        service = new WarehouseService();
    });

    it('should register an ENTRY movement for a new product', async () => {
        mockEntityManager.findOne.mockResolvedValue(null);

        const movementDto = { productId: 101, quantity: 10, type: 'ENTRY' as const };
        await service.registerMovement(movementDto, mockI18n, 'user-123');

        expect(mockEntityManager.create).toHaveBeenCalledWith(Stock, { productId: 101, quantity: 0 });
        expect(mockEntityManager.save).toHaveBeenCalledWith(expect.objectContaining({ productId: 101, quantity: 10 }));
        expect(mockEntityManager.save).toHaveBeenCalledWith(expect.objectContaining({ productId: 101, type: 'ENTRY', createdBy: 'user-123' }));
    });

    it('should register an EXIT movement with sufficient stock', async () => {
        const existingStock = { id: 1, productId: 102, quantity: 50 };
        mockEntityManager.findOne.mockResolvedValue(existingStock);

        const movementDto = { productId: 102, quantity: 20, type: 'EXIT' as const };
        await service.registerMovement(movementDto, mockI18n);

        expect(mockEntityManager.save).toHaveBeenCalledWith(expect.objectContaining({ productId: 102, quantity: 30 }));
        expect(mockEntityManager.save).toHaveBeenCalledWith(expect.objectContaining({ productId: 102, type: 'EXIT' }));
    });

    it('should throw an error for an EXIT movement with insufficient stock', async () => {
        const existingStock = { id: 1, productId: 103, quantity: 5 };
        mockEntityManager.findOne.mockResolvedValue(existingStock);

        const movementDto = { productId: 103, quantity: 10, type: 'EXIT' as const };

        await expect(service.registerMovement(movementDto, mockI18n)).rejects.toThrow(
            'errors.insufficientStock (productId: 103)'
        );
    });

    it('should throw an error if product does not exist for an EXIT movement', async () => {
        mockEntityManager.findOne.mockResolvedValue(null);
        const movementDto = { productId: 999, quantity: 1, type: 'EXIT' as const };

        await expect(service.registerMovement(movementDto, mockI18n)).rejects.toThrow(
            'errors.insufficientStock (productId: 999)'
        );
    });
});