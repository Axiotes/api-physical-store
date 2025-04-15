import { BadRequestException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Product } from '../../interfaces/product.interface';
import { StoreShipping } from '../../interfaces/store-shipping.interface';
import { MelhorEnvioApiService } from '../../requests/melhor-envio-api/melhor-envio-api.service';
import { StoreRoute } from '../../interfaces/store-route.interface';
import { AxiosResponse } from 'axios';

@Injectable()
export class LogisticUtilsService {
  constructor(private readonly melhorEnvioApiService: MelhorEnvioApiService) {}

  public async getShipping(
    storesRoutes: StoreRoute[],
    to: string,
    products: Product[],
  ): Promise<StoreShipping[]> {
    const shippingPromises = storesRoutes.map(async (storeRoute) => {
      const res: AxiosResponse<MelhorEnvioResponse[]> = await lastValueFrom(
        this.melhorEnvioApiService.shipping(storeRoute.store.cep, to, products),
      );
      const data: MelhorEnvioResponse[] = res.data;

      if (!data || data.length === 0) {
        return null;
      }

      return {
        store: storeRoute.store,
        distance: storeRoute.distance,
        shipping: data.map((item: MelhorEnvioResponse) => ({
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
      } as StoreShipping;
    });

    const shipping = await Promise.all(shippingPromises);

    return shipping.filter((item) => item !== null);
  }

  public deliveryTime(distance: number) {
    const maxDistance = 50000;
    const maxMinDays = 12;

    if (distance > maxDistance) {
      throw new BadRequestException(
        `Distance exceeds the maximum limit of ${maxDistance / 1000} km`,
      );
    }

    const min = Math.ceil((distance / maxDistance) * (maxMinDays - 1)) + 1;
    const max = min + 1;

    return { min, max };
  }
}
