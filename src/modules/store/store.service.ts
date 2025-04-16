import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { Repository } from 'typeorm';
import { GeoUtilsService } from '../../common/utils/geo-utils/geo-utils.service';
import { StoreInterface } from '../../common/interfaces/store.interface';
import { StoreRoute } from '../../common/interfaces/store-route.interface';
import { Product } from '../../common/interfaces/product.interface';
import { StoreShipping } from '../../common/interfaces/store-shipping.interface';
import { LogisticUtilsService } from '../../common/utils/logistic-utils/logistic-utils.service';
import { PaginationDto } from './dtos/pagination.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private readonly geoUtilsService: GeoUtilsService,
    private readonly logisticUtilsService: LogisticUtilsService,
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
      throw new NotFoundException('No stores found within 100km radius');
    }

    return closerStores;
  }

  public async storesShipping(
    cep: string,
    products: Product[],
    pagination: PaginationDto,
  ): Promise<StoreShipping[]> {
    const address: string = await this.geoUtilsService.getAddress(cep);
    const { lat, lng } = await this.geoUtilsService.getCoordinate(address);

    const stores: StoreInterface[] = await this.storeRepository
      .createQueryBuilder('store')
      .skip(pagination.offset)
      .take(pagination.limit)
      .getMany();

    const storesRoutes: StoreRoute[] = await this.geoUtilsService.getDistance(
      { lat, lng },
      stores,
    );

    const storesFarther50km: StoreRoute[] = [];
    const storesWithin50km: StoreShipping[] = storesRoutes.map((storeRoute) => {
      if (storeRoute.distance.value > 50000) {
        storesFarther50km.push(storeRoute);
        return null;
      }

      return {
        store: storeRoute.store,
        distance: storeRoute.distance,
        shippings: [
          {
            id: storeRoute.store.id,
            name: storeRoute.store.name,
            price: '15.00',
            discount: '0',
            currency: 'R$',
            delivery_range: this.logisticUtilsService.deliveryTime(
              storeRoute.distance.value,
            ),
            company: {
              id: storeRoute.store.id,
              name: storeRoute.store.name,
            },
          },
        ],
      };
    });

    const farther50kmShippings: StoreShipping[] =
      storesFarther50km.length > 0
        ? await this.logisticUtilsService.getShipping(
            storesFarther50km,
            cep,
            products,
          )
        : [];

    const storeShippings: StoreShipping[] = [
      ...farther50kmShippings,
      ...storesWithin50km.filter((item) => item !== null),
    ].sort((a, b) => a.distance.value - b.distance.value);

    return storeShippings;
  }

  public async findAll(pagination: PaginationDto): Promise<StoreInterface[]> {
    return await this.storeRepository
      .createQueryBuilder('store')
      .skip(pagination.offset)
      .take(pagination.limit)
      .getMany();
  }

  public async findBy<T extends keyof StoreInterface>(
    key: T,
    value: StoreInterface[T],
  ): Promise<StoreInterface> {
    const store = await this.storeRepository.findOne({
      where: { [key]: value },
    });

    if (!store) {
      throw new NotFoundException(`Store not found`);
    }

    return store;
  }
}
