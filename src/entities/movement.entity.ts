import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm";

export type MovementType = 'ENTRY' | 'EXIT';

@Entity('movements')
export class Movement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column()
    productId: number;

    @Column({
        type: 'enum',
        enum: ['ENTRY', 'EXIT'],
    })
    type: MovementType;

    @Column({ type: 'integer' })
    quantity: number;

    @Column({ nullable: true })
    orderId?: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    createdBy?: string;
}