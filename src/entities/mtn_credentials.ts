import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mtn_Credentials {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  primary_key: string;

  @Column()
  secondary_key: string;

  @Column()
  mtn_user_id: string;

  @Column()
  mtn_key: string

  @Column()
  user_id: number
}