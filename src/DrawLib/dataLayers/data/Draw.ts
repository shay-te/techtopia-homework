import 'reflect-metadata';
import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

@Entity()
export class Draw {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  name!: string;

  @Column()
  items!: Rect[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  deletedAt?: Date; // optional for soft delete  
}