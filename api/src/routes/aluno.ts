import { Router } from "express"
import z from "zod"
import { AppDataSource } from "../database/data-source"
import { Aluno } from "../models/Aluno"
import AppError from "../utils/AppError"

const router = Router()
const alunoRepository = AppDataSource.getRepository(Aluno)

const alunoSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  cpf: z.string().min(11, "CPF inválido"),
  matricula: z.string().min(1, "Matrícula obrigatória"),
  curso: z.string().optional(),
  periodo: z.number({ message: "Período obrigatório" }),
  apto: z.number().optional(),
  status: z.string().optional(),
})

router.get("/", async (req, res, next) => {
  try {
    const alunos = await alunoRepository.find()
    res.json(alunos)
  } catch (error) {
    next(error)
  }
})

router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const aluno = await alunoRepository.findOneBy({ id })
    if (!aluno) throw new AppError("Aluno não encontrado", 404)
    res.json(aluno)
  } catch (error) {
    next(error)
  }
})

router.post("/", async (req, res, next) => {
  try {
    const body = alunoSchema.parse(req.body)
    const aluno = alunoRepository.create(body)
    const result = await alunoRepository.save(aluno)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const aluno = await alunoRepository.findOneBy({ id })
    if (!aluno) throw new AppError("Aluno não encontrado", 404)
    const body = alunoSchema.partial().parse(req.body)
    alunoRepository.merge(aluno, body)
    const result = await alunoRepository.save(aluno)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const aluno = await alunoRepository.findOneBy({ id })
    if (!aluno) throw new AppError("Aluno não encontrado", 404)
    await alunoRepository.remove(aluno)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router