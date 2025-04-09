import { Store } from '../../modules/store/store.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { STORES } from '../mocks/stores.mock';

export default class FakeStoresSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const repository = dataSource.getRepository(Store);

    for (let i = 0; i < STORES.length; i++) {
        const store = STORES[i];

        const newStore = await repository.create(store);
        await repository.save(newStore);
    }
  }
}
