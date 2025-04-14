import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Product } from '../../interfaces/product.interface';
import { StoreFreights } from '../../interfaces/store-freights.interface';
import { MelhorEnvioApiService } from '../../requests/melhor-envio-api/melhor-envio-api.service';
import { StoreRoute } from 'src/common/interfaces/store-route.interface';
import { AxiosResponse } from 'axios';

@Injectable()
export class LogisticUtilsService {
  constructor(private readonly melhorEnvioApiService: MelhorEnvioApiService) {}

  public async getFreight(
    storesRoutes: StoreRoute[],
    to: string,
    products: Product[],
  ): Promise<StoreFreights[]> {
    const freightPromises = storesRoutes.map(async (storeRoute) => {
      const res: AxiosResponse<MelhorEnvioResponse[]> = await lastValueFrom(
        this.melhorEnvioApiService.freight(storeRoute.store.cep, to, products),
      );
      const data: MelhorEnvioResponse[] = res.data;

      if (!data || data.length === 0) {
        return null;
      }

      return {
        store: storeRoute.store,
        distance: storeRoute.distance,
        freights: data.map((item: MelhorEnvioResponse) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          discount: item.discount,
          currency: item.currency,
          delivery_range: item.delivery_range,
          company: {
            id: item.company.id,
            name: item.company.name,
          },
        })),
      } as StoreFreights;
    });

    const freights = await Promise.all(freightPromises);

    return freights.filter((item) => item !== null);
  }
}
