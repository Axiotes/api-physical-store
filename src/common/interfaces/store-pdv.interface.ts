import { StoreTypeEnum } from "../enums/store-type.enum";
import { StoreBase } from "./store-base.interface";

export interface StorePDV extends StoreBase {
  type: StoreTypeEnum.PDV;
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
