import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStoreTable1744139367448 implements MigrationInterface {
    name = 'CreateStoreTable1744139367448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`store\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('pdv', 'LOJA') NOT NULL, \`name\` varchar(255) NOT NULL, \`cep\` varchar(255) NOT NULL, \`street\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`number\` int NOT NULL, \`neighborhood\` varchar(255) NOT NULL, \`state\` varchar(255) NOT NULL, \`region\` varchar(255) NOT NULL, \`lat\` varchar(255) NOT NULL, \`lng\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`store\``);
    }

}
