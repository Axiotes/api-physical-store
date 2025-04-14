import { Freight } from './freight.interface';
import { RouteInfo } from './route-info.interface';
import { StoreInterface } from './store.interface';

export interface StoreFreights {
  store: StoreInterface;
  distance: RouteInfo;
  freights: Freight[];
}
