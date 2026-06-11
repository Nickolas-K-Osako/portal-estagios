import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateVaga1781050222612 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
      name: "vaga",
      columns: [
        {
          name: "id",
          type: "int",
          isPrimary: true,
          isGenerated: true,
          generationStrategy: "increment"
        },
        {
          name: "empresa_id",
          type: "int"
        },
        {
          name: "titulo",
          type: "varchar",
          length: "255"
        },
        {
          name: "descricao",
          type: "text"
        },
        {
          name: "area",
          type: "varchar",
          length: "100"
        },
        {
          name: "requisitos",
          type: "varchar",
          length: "100",
          isNullable: true
        },
        {
          name: "carga_horaria",
          type: "float",
          isNullable: true
        },
        {
          name: "modalidade",
          type: "varchar",
          length: "50",
          isNullable: true
        },
        {
          name: "status",
          type: "varchar",
          length: "20",
          default: "'aberta'"
        },
        {
          name: "created_at",
          type: "datetime",
          default: "CURRENT_TIMESTAMP"
        }
      ]
    }))

      await queryRunner.createForeignKey("vaga", new TableForeignKey({
      columnNames: ["empresa_id"],
      referencedTableName: "empresa",
      referencedColumnNames: ["id"],
      onDelete: "CASCADE"
    }))

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.dropTable("vaga")
    }

}
