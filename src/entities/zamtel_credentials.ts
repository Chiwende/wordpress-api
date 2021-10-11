import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Zamtel_Credentials {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  third_party_id: string;

  @Column()
  password  : string;

  @Column()
  shortCode: string;

  @Column()
  user_id: number;
}