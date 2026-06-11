import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm"
import { Aluno } from "./Aluno"
import { Candidatura } from "./Candidatura"

@Entity("notificacao")
export class Notificacao {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "text" })
  mensagem: string

  @Column({ type: "tinyint", default: 0 })
  lida: number

  @CreateDateColumn()
  created_at: Date

  @ManyToOne(() => Aluno, aluno => aluno.candidaturas)
  @JoinColumn({ name: "aluno_id" })
  aluno: Aluno

  @ManyToOne(() => Candidatura, candidatura => candidatura.notificacoes)
  @JoinColumn({ name: "candidatura_id" })
  candidatura: Candidatura
}