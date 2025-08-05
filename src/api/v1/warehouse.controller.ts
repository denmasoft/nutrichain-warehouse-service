import { Request, Response, NextFunction } from 'express';
import { WarehouseService } from '../../services/warehouse.service';
import { CreateMovementDto } from '../../dto/create-movement.dto';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import logger from '../../utils/logger';

export class WarehouseController {
    constructor(private warehouseService: WarehouseService) {}

    public getStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const productId = parseInt(req.params.productId, 10);
            const stock = await this.warehouseService.getStockByProductId(productId);
            if (!stock) {
                res.status(404).json({ message: req.t('errors.productNotFound', { productId }) });
                return;
            }
            res.status(200).json(stock);
        } catch (error) {
            logger.error(`Error fetching stock for product ${req.params.productId}:`, error);
            next(error);
        }
    };

    public createMovement = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const movementDto: CreateMovementDto = req.body;
            const userId = req.user?.id; // De JWT

            const newMovement = await this.warehouseService.registerMovement(movementDto, req.i18n, userId);
            
            logger.info(`Movement created by user ${userId}: ${JSON.stringify(newMovement)}`);
            res.status(201).json({ message: req.t('success.movementRegistered'), data: newMovement });
        } catch (error) {
            logger.error('Error creating movement:', error);
            next(error);
        }
    };
}