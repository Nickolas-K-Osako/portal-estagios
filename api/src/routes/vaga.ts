import { Router } from "express"
import z from "zod"
import { AppDataSource } from "../database/data-source"
import { Vaga } from "../models/Vaga"
import AppError from "../utils/AppError"

const router = Router()
const vagaRepository = AppDataSource.getRepository(Vaga)

const vagaSchema = z.object({
  titulo: z.string().min(1, "Título obrigatório"),
  descricao: z.string().min(1, "Descrição obrigatória"),
  area: z.string().min(1, "Área obrigatória"),
  requisitos: z.string().optional(),
  carga_horaria: z.number().optional(),
  modalidade: z.string().optional(),
  status: z.string().optional(),
  empresa_id: z.number({ message: "Empresa obrigatória" })
})

router.get("/", async (req, res) => {
 const vagas = await vagaRepository.find({ relations: { empresa: true } })
  res.json(vagas)
})

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id)
  const vaga = await vagaRepository.findOne({
  where: { id },
  relations: { empresa: true }
})
  if (!vaga) throw new AppError("Vaga não encontrada", 404)
  res.json(vaga)
})

router.post("/", async (req, res) => {
  const body = vagaSchema.parse(req.body)
  const vaga = vagaRepository.create(body)
  const result = await vagaRepository.save(vaga)
  res.status(201).json(result)
})

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id)
  const vaga = await vagaRepository.findOneBy({ id })
  if (!vaga) throw new AppError("Vaga não encontrada", 404)
  const body = vagaSchema.partial().parse(req.body)
  vagaRepository.merge(vaga, body)
  const result = await vagaRepository.save(vaga)
  res.json(result)
})

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id)
  const vaga = await vagaRepository.findOneBy({ id })
  if (!vaga) throw new AppError("Vaga não encontrada", 404)
  await vagaRepository.remove(vaga)
  res.status(204).send()
})

export default router