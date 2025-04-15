import { Type } from 'class-transformer';
import { ValidateNested, IsArray, ArrayNotEmpty } from 'class-validator';
import { ProductDto } from './products.dto';

export class ShippingBodyDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
