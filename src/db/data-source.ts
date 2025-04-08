import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const dataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  entities: [path.resolve(__dirname, '../**/*.entity.{ts,js}')],
  synchronize: false,
  logging: true,
  seeds: [],
  migrations: [path.resolve(__dirname, './migrations/*.{ts,js}')],
} as DataSourceOptions & SeederOptions;

export const AppDataSource = new DataSource(dataSourceOptions);