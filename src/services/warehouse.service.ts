import { AppDataSource } from "../config/database";
import { CreateMovementDto } from "../dto/create-movement.dto";
import { Movement, MovementType } from "../entities/movement.entity";
import { Stock } from "../entities/stock.entity";
import { Repository } from "typeorm";
import { I18n } from "i18next";

export class WarehouseService {
    private stockRepository: Repository<Stock>;
    private movementRepository: Repository<Movement>;

    constructor() {
        this.stockRepository = AppDataSource.getRepository(Stock);
        this.movementRepository = AppDataSource.getRepository(Movement);
    }

    public async getStockByProductId(productId: number): Promise<Stock | null> {
        return this.stockRepository.findOneBy({ productId });
    }

    public async registerMovement(
        movementDto: CreateMovementDto, 
        i18n: I18n,
        userId?: string
    ): Promise<Movement> {
        const { productId, quantity, type, orderId } = movementDto;

        if (quantity <= 0) {
            throw new Error("Quantity must be positive.");
        }

        return AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            let stock = await transactionalEntityManager.findOne(Stock, {
                where: { productId },
                lock: { mode: "pessimistic_write" }
            });

            if (type === 'EXIT') {
                if (!stock || stock.quantity < quantity) {
                    const available = stock ? stock.quantity : 0;
                    throw new Error(i18n.t('errors.insufficientStock', { productId, available, required: quantity }));
                }
                stock.quantity -= quantity;
            } else if (type === 'ENTRY') {
                if (!stock) {
                    stock = transactionalEntityManager.create(Stock, { productId, quantity: 0 });
                }
                stock.quantity += quantity;
            } else {
                throw new Error(i18n.t('errors.invalidMovementType'));
            }
            
            await transactionalEntityManager.save(Stock, stock);

            const newMovement = transactionalEntityManager.create(Movement, {
                productId,
                quantity,
                type,
                orderId,
                createdBy: userId // Blameable
            });

            return transactionalEntityManager.save(Movement, newMovement);
        });
    }
}