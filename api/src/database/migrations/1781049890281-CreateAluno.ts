import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAluno1781049890281 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.createTable(new Table({
      name: "aluno",
      columns: [
        {
          name: "id",
          type: "int",
          isPrimary: true,
          isGenerated: true,
          generationStrategy: "increment"
        },
        {
          name: "nome",
          type: "varchar",
          length: "255"
        },
        {
          name: "email",
          type: "varchar",
          length: "255",
          isUnique: true
        },
        {
          name: "cpf",
          type: "varchar",
          length: "11",
          isUnique: true
        },
        {
          name: "matricula",
          type: "varchar",
          length: "20",
          isUnique: true
        },
        {
          name: "curso",
          type: "varchar",
          length: "100",
          isNullable: true
        },
        {
          name: "periodo",
          type: "int"
        },
        {
          name: "apto",
          type: "tinyint",
          default: 1
        },
        {
          name: "status",
          type: "varchar",
          length: "20",
          default: "'ativo'"
        },
        {
          name: "created_at",
          type: "datetime",
          default: "CURRENT_TIMESTAMP"
        }
      ]
    }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("aluno")
    }

}
