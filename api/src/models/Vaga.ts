import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from "typeorm"
import { Empresa } from "./Empresa"
import { Candidatura } from "./Candidatura"

@Entity("vaga")
export class Vaga {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: 255 })
  titulo: string

  @Column({ type: "text" })
  descricao: string

  @Column({ type: "varchar", length: 100 })
  area: string

  @Column({ type: "varchar", length: 100, nullable: true })
  requisitos: string

  @Column({ type: "float", nullable: true })
  carga_horaria: number

  @Column({ type: "varchar", length: 50, nullable: true })
  modalidade: string

  @Column({ type: "varchar", length: 20, default: "aberta" })
  status: string

  @CreateDateColumn()
  created_at: Date

  @ManyToOne(() => Empresa, empresa => empresa.vagas)
  @JoinColumn({ name: "empresa_id" })
  empresa: Empresa

  @OneToMany(() => Candidatura, candidatura => candidatura.vaga)
  candidaturas: Candidatura[]
}