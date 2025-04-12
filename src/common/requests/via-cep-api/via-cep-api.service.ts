import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ViaCepResponse } from 'src/common/interfaces/via-cep-response.interface';

@Injectable()
export class ViaCepApiService {
  constructor(private readonly httpService: HttpService) {}

  public viaCep(cep: string): Observable<AxiosResponse<ViaCepResponse>> {
    return this.httpService.get<ViaCepResponse>(
      `https://viacep.com.br/ws/${cep}/json`,
    );
  }
}
