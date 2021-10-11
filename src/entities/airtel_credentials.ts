import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Airtel_Credentials {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  client_id: string;

  @Column()
  secret_key: string;
}