import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateNotificacao1781050575930 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.createTable(new Table({
      name: "notificacao",
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
          name: "candidatura_id",
          type: "int"
        },
        {
          name: "mensagem",
          type: "text"
        },
        {
          name: "lida",
          type: "tinyint",
          default: 0
        },
        {
          name: "created_at",
          type: "datetime",
          default: "CURRENT_TIMESTAMP"
        }
      ]
    }))

    await queryRunner.createForeignKey("notificacao", new TableForeignKey({
      columnNames: ["aluno_id"],
      referencedTableName: "aluno",
      referencedColumnNames: ["id"],
      onDelete: "CASCADE"
    }))

    await queryRunner.createForeignKey("notificacao", new TableForeignKey({
      columnNames: ["candidatura_id"],
      referencedTableName: "candidatura",
      referencedColumnNames: ["id"],
      onDelete: "CASCADE"
    }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.dropTable("notificacao")
    }

}
