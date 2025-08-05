import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";

@Entity('stocks')
export class Stock {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    productId: number;

    @Column({ type: 'integer', default: 0 })
    quantity: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}