import { Freight } from "./freight.interface";
import { StoreInterface } from "./store.interface";

export interface StoreFreights {
    store: StoreInterface;
    freights: Freight[];
}