import { DataSource } from 'typeorm';
import { runSeeder, Seeder, SeederFactoryManager } from 'typeorm-extension';
import FakeStoresSeeder from './fake-stores.seed';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    if (process.env.FAKE_DATA) {
        await runSeeder(dataSource, FakeStoresSeeder);
    }
  }
}