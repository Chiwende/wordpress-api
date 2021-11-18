import { Entity, Column, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import moment = require('moment');

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  msisdn: string;

  @Column()
  amount  : string;

  @Column()
  reference: string;

  @Column()
  transaction_id: string;

  @Column()
  description: string

  @Column()
  firstname: string

  @Column()
  lastname: string

  @Column()
  email: string

  @Column()
  user_id: number

  @Column({default: 300})
  status: number

  @Column({default: moment().format('YYYY-MM-DD')})
  created_at: Date

  @Column({default: moment().format('YYYY-MM-DD')})
  updated_at: Date
}