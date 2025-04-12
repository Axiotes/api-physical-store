import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { Repository } from 'typeorm';
import { GeoUtilsService } from 'src/common/utils/geo-utils/geo-utils.service';
import { GoogleApisService } from 'src/common/requests/google-apis/google-apis.service';
import { StoreInterface } from 'src/common/interfaces/store.interface';
import { lastValueFrom } from 'rxjs';
import { DirectionsResponse } from 'src/common/interfaces/diretions-response.interface';
import { StoreRoute } from 'src/common/interfaces/store-route.interface';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private readonly geoUtilsService: GeoUtilsService,
    private readonly googleApisService: GoogleApisService,
  ) {}

  public async closerStores(cep: string): Promise<StoreRoute[]> {
    const address: string = await this.geoUtilsService.getAddress(cep);
    const { lat, lng } = await this.geoUtilsService.getCoordinate(address);
    const stores: StoreInterface[] = await this.storeRepository.find();

    const diretionsPromises = stores.map(async (store) => {
      const res = await lastValueFrom(
        this.googleApisService.directions(
          { lat, lng },
          { lat: Number(store.lat), lng: Number(store.lng) },
        ),
      );

      const data: DirectionsResponse = res.data;

      if (!data || data.status === 'ZERO_RESULTS') {
        return null;
      }

      const distance = data.routes[0].legs[0].distance;
      const duration = data.routes[0].legs[0].duration;

      return {
        store,
        distance,
        duration,
      } as StoreRoute;
    });

    const storesRoutes: StoreRoute[] = await Promise.all(diretionsPromises);

    const closerStores: StoreRoute[] = storesRoutes
      .filter((storeRoute) => {
        if (!storeRoute || storeRoute.distance.value >= 100000) {
          return;
        }

        return storeRoute;
      })
      .sort((a, b) => a.distance.value - b.distance.value);

    if (closerStores.length === 0) {
      throw new NotFoundException('No stores found within 100km radius.');
    }

    return closerStores;
  }
}
