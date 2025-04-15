import { Shipping } from './shipping.interface';
import { RouteInfo } from './route-info.interface';
import { StoreInterface } from './store.interface';

export interface StoreShipping {
  store: StoreInterface;
  distance: RouteInfo;
  shippings: Shipping[];
}
