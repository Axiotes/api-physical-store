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

  @Column()
  cep: string;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  number: number;

  @Column()
  neighborhood: string;

  @Column()
  state: string;

  @Column()
  uf: string;

  @Column()
  region: string;

  @Column()
  lat: string;

  @Column()
  lng: string;
}
