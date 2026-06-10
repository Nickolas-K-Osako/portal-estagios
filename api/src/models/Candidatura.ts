import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm"
import { Aluno } from "./Aluno"
import { Vaga } from "./Vaga"
import { Notificacao } from "./Notificacao"

@Entity("candidatura")
export class Candidatura {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: 30, default: "pendente" })
  status: string

  @Column({ type: "varchar", length: 255, nullable: true })
  observacao: string

  @Column({ type: "date", nullable: true })
  data_candidatura: Date

  @UpdateDateColumn()
  updated_at: Date

  @ManyToOne(() => Aluno, aluno => aluno.candidaturas)
  @JoinColumn({ name: "aluno_id" })
  aluno: Aluno

  @ManyToOne(() => Vaga, vaga => vaga.candidaturas)
  @JoinColumn({ name: "vaga_id" })
  vaga: Vaga

  @OneToMany(() => Notificacao, notificacao => notificacao.candidatura)
  notificacoes: Notificacao[]
}