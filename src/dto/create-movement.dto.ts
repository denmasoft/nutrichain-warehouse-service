import { MovementType } from "../entities/movement.entity";

export interface CreateMovementDto {
    productId: number;
    quantity: number;
    type: MovementType;
    orderId?: string;
}