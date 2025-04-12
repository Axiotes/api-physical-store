import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeocodeResponse } from 'src/common/interfaces/geocode-response.interface';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { LatLng } from 'src/common/interfaces/lat-lng.interface';
import { DirectionsResponse } from 'src/common/interfaces/diretions-response.interface';

@Injectable()
export class GoogleApisService {
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    this.apiKey = this.config.get<string>('GOOGLE_API_KEY');

    if (!this.apiKey) {
      throw new InternalServerErrorException('Google API key not found');
    }
  }

  public geocode(address: string): Observable<AxiosResponse<GeocodeResponse>> {
    return this.httpService.get<GeocodeResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address,
      )}&key=${this.apiKey}`,
    );
  }

  public directions(
    origin: LatLng,
    destination: LatLng,
  ): Observable<AxiosResponse<DirectionsResponse>> {
    return this.httpService.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${this.apiKey}`,
    );
  }
}
