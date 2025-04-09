import { StoreTypeEnum } from '../enums/store-type.enum';

export interface Store {
  id: number;
  type: StoreTypeEnum;
  name: string;
  cep: string;
  street: string;
  city: string;
  number: number;
  neighborhood: string;
  state: string;
  uf: string;
  region: string;
  lat: string;
  lng: string;
}
