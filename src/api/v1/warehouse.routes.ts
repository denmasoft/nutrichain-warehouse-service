import { Router } from 'express';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from '../../services/warehouse.service';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const warehouseService = new WarehouseService();
const warehouseController = new WarehouseController(warehouseService);

// Versioning: All routes are under /api/v1
router.get('/stock/:productId', authMiddleware, warehouseController.getStock);
router.post('/movements', authMiddleware, warehouseController.createMovement);

export default router;