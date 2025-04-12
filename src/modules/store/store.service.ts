import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { Repository } from 'typeorm';
import { GeoUtilsService } from 'src/common/utils/geo-utils/geo-utils.service';
import { StoreInterface } from 'src/common/interfaces/store.interface';
import { StoreRoute } from 'src/common/interfaces/store-route.interface';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private readonly geoUtilsService: GeoUtilsService,
  ) {}

  public async closerStores(cep: string): Promise<StoreRoute[]> {
    const address: string = await this.geoUtilsService.getAddress(cep);
    const { lat, lng } = await this.geoUtilsService.getCoordinate(address);

    const stores: StoreInterface[] = await this.storeRepository.find();

    const storesRoutes: StoreRoute[] = await this.geoUtilsService.getDistance(
      { lat, lng },
      stores,
    );

    const closerStores: StoreRoute[] = storesRoutes
      .filter((storeRoute) => storeRoute.distance.value <= 100000)
      .sort((a, b) => a.distance.value - b.distance.value);

    if (closerStores.length === 0) {
      throw new NotFoundException('No stores found within 100km radius.');
    }

    return closerStores;
  }
}
