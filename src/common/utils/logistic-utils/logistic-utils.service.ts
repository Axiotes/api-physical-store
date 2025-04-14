import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Product } from '../../interfaces/product.interface';
import { StoreFreights } from '../../interfaces/store-freights.interface';
import { StoreInterface } from '../../interfaces/store.interface';
import { MelhorEnvioApiService } from '../../requests/melhor-envio-api/melhor-envio-api.service';

@Injectable()
export class LogisticUtilsService {
  constructor(private readonly melhorEnvioApiService: MelhorEnvioApiService) {}

  public async getFreight(
    stores: StoreInterface[],
    to: string,
    products: Product[],
  ): Promise<StoreFreights[]> {
    const freightPromises = stores.map(async (store) => {
      const res = await lastValueFrom(
        this.melhorEnvioApiService.freight(store.cep, to, products),
      );
      const data = res.data;

      if (!data || data.length === 0) {
        return null;
      }

      return {
        store,
        freights: data.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          discount: item.discount,
          currency: item.currency,
          delivery_range: {
            min: item.delivery_range.min,
            max: item.delivery_range.max,
          },
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
