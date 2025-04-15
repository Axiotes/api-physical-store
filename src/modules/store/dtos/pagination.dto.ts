import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ description: "Número de lojas que serão retornadas" })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit: number;

  @ApiPropertyOptional({ description: "Número de lojas que serão puladas" })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  offset: number;
}
