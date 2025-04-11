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

@Injectable()
export class GeoUtilsService {
  constructor(
    private readonly viaCepApiService: ViaCepApiService,
    private readonly googleApisService: GoogleApisService,
  ) {}

  public async getAddress(cep: string): Promise<string> {
    try {
      const res = await lastValueFrom(this.viaCepApiService.viaCep(cep));
      const data: ViaCepResponse = res.data;

      if (!data || data.error) {
        throw new NotFoundException('Address not found');
      }

      return `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  public async getCoordinate(address: string): Promise<LatLng> {
    try {
      const res = await lastValueFrom(this.googleApisService.geocode(address));
      const data: GeocodeResponse = res.data;

      if (!data || data.status === 'ZERO_RESULTS') {
        throw new NotFoundException('Coordinates not found');
      }

      return data.results[0].geometry.location;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
