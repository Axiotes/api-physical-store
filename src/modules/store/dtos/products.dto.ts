import { IsString, IsNumber } from 'class-validator';

export class ProductDto {
  @IsString()
  id: string;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsNumber()
  length: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  insurance_value: number;

  @IsNumber()
  quantity: number;
}
