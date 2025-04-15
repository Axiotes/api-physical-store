import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class ProductDto {
  @ApiProperty({ description: 'ID do produto (cm)' })
  @IsString()
  @Min(0.1)
  id: string;

  @ApiProperty({ description: 'Largura do produto (cm)' })
  @IsNumber()
  @Min(0.1)
  width: number;

  @ApiProperty({ description: 'Altura do produto (cm)' })
  @IsNumber()
  @Min(0.1)
  height: number;

  @ApiProperty({ description: 'Comprimento do produto (cm)' })
  @IsNumber()
  @Min(0.1)
  length: number;

  @ApiProperty({ description: 'Peso do produto (kg)' })
  @IsNumber()
  @Min(0.001)
  weight: number;

  @ApiProperty({ description: 'Valor do Seguro do produto' })
  @IsNumber()
  @Min(0)
  insurance_value: number;

  @ApiProperty({ description: 'Quantidade do produto' })
  @IsNumber()
  @Min(1)
  quantity: number;
}
