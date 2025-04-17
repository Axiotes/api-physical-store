import { StoreTypeEnum } from '../../common/enums/store-type.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: StoreTypeEnum })
  type: StoreTypeEnum;

  @Column()
  name: string;

  @Column({ nullable: true })
  cep: string;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  number: number;

  @Column({ nullable: true })
  neighborhood: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  uf: string;

  @Column({ nullable: true })
  region: string;

  @Column({ nullable: true })
  lat: string;

  @Column({ nullable: true })
  lng: string;
}
