import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateCandidatura1781050458237 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
      name: "candidatura",
      columns: [
        {
          name: "id",
          type: "int",
          isPrimary: true,
          isGenerated: true,
          generationStrategy: "increment"
        },
        {
          name: "aluno_id",
          type: "int"
        },
        {
          name: "vaga_id",
          type: "int"
        },
        {
          name: "status",
          type: "varchar",
          length: "30",
          default: "'pendente'"
        },
        {
          name: "observacao",
          type: "varchar",
          length: "255",
          isNullable: true
        },
        {
          name: "data_candidatura",
          type: "date",
          isNullable: true
        },
        {
          name: "updated_at",
          type: "datetime",
          default: "CURRENT_TIMESTAMP",
          onUpdate: "CURRENT_TIMESTAMP"
        }
      ]
    }))

    await queryRunner.createForeignKey("candidatura", new TableForeignKey({
      columnNames: ["aluno_id"],
      referencedTableName: "aluno",
      referencedColumnNames: ["id"],
      onDelete: "CASCADE"
    }))

    await queryRunner.createForeignKey("candidatura", new TableForeignKey({
      columnNames: ["vaga_id"],
      referencedTableName: "vaga",
      referencedColumnNames: ["id"],
      onDelete: "CASCADE"
    }))
  }
    

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.dropTable("candidatura")
    }

}
