import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  offset: number;
}
