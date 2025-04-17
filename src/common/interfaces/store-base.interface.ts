import { StoreTypeEnum } from "../enums/store-type.enum";

export interface StoreBase {
  id: number;
  name: string;
  type: StoreTypeEnum;
}
