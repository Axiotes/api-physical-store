import { Type } from 'class-transformer';
import { ValidateNested, IsArray, ArrayNotEmpty } from 'class-validator';
import { ProductDto } from './products.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ShippingBodyDto {
  @ApiProperty({
    description: 'Lista de produtos',
    type: [ProductDto],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
