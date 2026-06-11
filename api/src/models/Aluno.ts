import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm"
import { Candidatura } from "./Candidatura"

@Entity("aluno")
export class Aluno {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: 255 })
  nome: string

  @Column({ type: "varchar", length: 255 })
  email: string

  @Column({ type: "varchar", length: 11 })
  cpf: string

  @Column({ type: "varchar", length: 20 })
  matricula: string

  @Column({ type: "varchar", length: 100, nullable: true })
  curso: string

  @Column({ type: "int" })
  periodo: number

  @Column({ type: "tinyint", default: 1 })
  apto: number

  @Column({ type: "varchar", length: 20, default: "ativo" })
  status: string

  @CreateDateColumn()
  created_at: Date

  @OneToMany(() => Candidatura, candidatura => candidatura.aluno)
  candidaturas: Candidatura[]
}