import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm"
import { Vaga } from "./Vaga"

@Entity("empresa")
export class Empresa {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: 255 })
  nome: string

  @Column({ type: "varchar", length: 14 })
  cnpj: string

  @Column({ type: "varchar", length: 255 })
  email: string

  @Column({ type: "varchar", length: 20, nullable: true })
  telefone: string

  @Column({ type: "varchar", length: 255, nullable: true })
  area_atuacao: string

  @Column({ type: "varchar", length: 20, default: "pendente" })
  status: string

  @CreateDateColumn()
  created_at: Date

  @OneToMany(() => Vaga, vaga => vaga.empresa)
  vagas: Vaga[]
}