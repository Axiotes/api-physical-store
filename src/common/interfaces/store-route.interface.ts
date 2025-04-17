import { RouteInfo } from './route-info.interface';
import { StorePDV } from './store-pdv.interface';

export interface StoreRoute {
  store: StorePDV;
  distance: RouteInfo;
  duration: RouteInfo;
}
