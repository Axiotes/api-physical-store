import { Shipping } from './shipping.interface';
import { RouteInfo } from './route-info.interface';
import { StorePDV } from './store-pdv.interface';

export interface StoreShipping {
  store: StorePDV;
  distance: RouteInfo;
  shippings: Shipping[];
}
