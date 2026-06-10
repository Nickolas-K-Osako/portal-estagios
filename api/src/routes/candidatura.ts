import { Router } from "express"
import z from "zod"
import { AppDataSource } from "../database/data-source"
import { Candidatura } from "../models/Candidatura"
import { Aluno } from "../models/Aluno"
import { Vaga } from "../models/Vaga"
import { Notificacao } from "../models/Notificacao"
import AppError from "../utils/AppError"

const router = Router()
const candidaturaRepository = AppDataSource.getRepository(Candidatura)
const alunoRepository = AppDataSource.getRepository(Aluno)
const vagaRepository = AppDataSource.getRepository(Vaga)
const notificacaoRepository = AppDataSource.getRepository(Notificacao)

const candidaturaSchema = z.object({
  aluno_id: z.number({ message: "Aluno obrigatório" }),
  vaga_id: z.number({ message: "Vaga obrigatória" }),
  observacao: z.string().optional(),
  data_candidatura: z.string().optional(),
})

const statusSchema = z.object({
  status: z.enum(["pendente", "aprovada", "rejeitada"], {
    message: "Status inválido"
  }),
})

router.get("/", async (req, res, next) => {
  try {
    const candidaturas = await candidaturaRepository.find({
      relations: { aluno: true, vaga: true }
    })
    res.json(candidaturas)
  } catch (error) {
    next(error)
  }
})

router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const candidatura = await candidaturaRepository.findOne({
      where: { id },
      relations: { aluno: true, vaga: true }
    })
    if (!candidatura) throw new AppError("Candidatura não encontrada", 404)
    res.json(candidatura)
  } catch (error) {
    next(error)
  }
})

router.post("/", async (req, res, next) => {
  try {
    const body = candidaturaSchema.parse(req.body)

    const aluno = await alunoRepository.findOneBy({ id: body.aluno_id })
    if (!aluno) throw new AppError("Aluno não encontrado", 404)

    const vaga = await vagaRepository.findOneBy({ id: body.vaga_id })
    if (!vaga) throw new AppError("Vaga não encontrada", 404)

    const candidatura = candidaturaRepository.create({
      ...body,
      aluno,
      vaga,
      data_candidatura: new Date(),
    })

    const result = await candidaturaRepository.save(candidatura)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

router.put("/:id/status", async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const candidatura = await candidaturaRepository.findOne({
      where: { id },
      relations: { aluno: true }
    })
    if (!candidatura) throw new AppError("Candidatura não encontrada", 404)

    const { status } = statusSchema.parse(req.body)
    candidatura.status = status
    const result = await candidaturaRepository.save(candidatura)

    // Cria notificação automaticamente
    const notificacao = notificacaoRepository.create({
      mensagem: `Sua candidatura foi ${status}.`,
      aluno: candidatura.aluno,
      candidatura: result,
    })
    await notificacaoRepository.save(notificacao)

    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const candidatura = await candidaturaRepository.findOneBy({ id })
    if (!candidatura) throw new AppError("Candidatura não encontrada", 404)
    await candidaturaRepository.remove(candidatura)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router