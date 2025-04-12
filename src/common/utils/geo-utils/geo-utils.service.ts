import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GoogleApisService } from '../../requests/google-apis/google-apis.service';
import { ViaCepApiService } from '../../requests/via-cep-api/via-cep-api.service';
import { ViaCepResponse } from '../../interfaces/via-cep-response.interface';
import { lastValueFrom } from 'rxjs';
import { LatLng } from '../../interfaces/lat-lng.interface';
import { GeocodeResponse } from '../../interfaces/geocode-response.interface';
import { StoreInterface } from 'src/common/interfaces/store.interface';
import { DirectionsResponse } from 'src/common/interfaces/diretions-response.interface';
import { StoreRoute } from 'src/common/interfaces/store-route.interface';

@Injectable()
export class GeoUtilsService {
  constructor(
    private readonly viaCepApiService: ViaCepApiService,
    private readonly googleApisService: GoogleApisService,
  ) {}

  public async getAddress(cep: string): Promise<string> {
    const res = await lastValueFrom(this.viaCepApiService.viaCep(cep));
    const data: ViaCepResponse = res.data;

    if (!data || data.error) {
      throw new NotFoundException('Address not found');
    }

    return `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`;
  }

  public async getCoordinate(address: string): Promise<LatLng> {
    const res = await lastValueFrom(this.googleApisService.geocode(address));
    const data: GeocodeResponse = res.data;

    if (!data || data.status === 'ZERO_RESULTS') {
      throw new NotFoundException('Coordinates not found');
    }

    return data.results[0].geometry.location;
  }

  public async getDistance(
    origin: LatLng,
    stores: StoreInterface[],
  ): Promise<StoreRoute[]> {
    const diretionsPromises = stores.map(async (store) => {
      const res = await lastValueFrom(
        this.googleApisService.directions(origin, {
          lat: Number(store.lat),
          lng: Number(store.lng),
        }),
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

    return storesRoutes.filter((storeRoute) => storeRoute !== null);
  }
}
