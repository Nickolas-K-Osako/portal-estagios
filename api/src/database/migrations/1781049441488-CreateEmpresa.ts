import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateEmpresa1781049441488 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.createTable(new Table({
      name: "empresa",
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
          name: "cnpj",
          type: "varchar",
          length: "14",
          isUnique: true
        },
        {
          name: "email",
          type: "varchar",
          length: "255",
          isUnique: true
        },
        {
          name: "telefone",
          type: "varchar",
          length: "20",
          isNullable: true
        },
        {
          name: "area_atuacao",
          type: "varchar",
          length: "255",
          isNullable: true
        },
        {
          name: "status",
          type: "varchar",
          length: "20",
          default: "'pendente'"
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
         await queryRunner.dropTable("empresa")
    }

}
