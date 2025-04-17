import { StoreTypeEnum } from "../enums/store-type.enum";
import { StoreBase } from "./store-base.interface";

export interface StoreLOJA extends StoreBase {
  type: StoreTypeEnum.LOJA;
}
