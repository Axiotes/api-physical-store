import { Store } from 'src/modules/store/store.entity';
import { RouteInfo } from './route-info.interface';

export interface StoreRoute {
  store: Store;
  distance: RouteInfo;
  duration: RouteInfo;
}
