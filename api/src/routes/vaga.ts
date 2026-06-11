import { Router } from "express"
import z from "zod"
import { AppDataSource } from "../database/data-source"
import { Vaga } from "../models/Vaga"
import { Empresa } from "../models/Empresa"
import AppError from "../utils/AppError"

const router = Router()
const vagaRepository = AppDataSource.getRepository(Vaga)
const empresaRepository = AppDataSource.getRepository(Empresa)

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

router.get("/", async (req, res, next) => {
  try {
    const vagas = await vagaRepository.find({ relations: { empresa: true } })
    res.json(vagas)
  } catch (error) {
    next(error)
  }
})

router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const vaga = await vagaRepository.findOne({
      where: { id },
      relations: { empresa: true }
    })
    if (!vaga) throw new AppError("Vaga não encontrada", 404)
    res.json(vaga)
  } catch (error) {
    next(error)
  }
})

router.post("/", async (req, res, next) => {
  try {
    const body = vagaSchema.parse(req.body)
    const empresa = await empresaRepository.findOneBy({ id: body.empresa_id })
    if (!empresa) throw new AppError("Empresa não encontrada", 404)
    const vaga = vagaRepository.create({ ...body, empresa })
    const result = await vagaRepository.save(vaga)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const vaga = await vagaRepository.findOneBy({ id })
    if (!vaga) throw new AppError("Vaga não encontrada", 404)
    const body = vagaSchema.partial().parse(req.body)
    if (body.empresa_id) {
      const empresa = await empresaRepository.findOneBy({ id: body.empresa_id })
      if (!empresa) throw new AppError("Empresa não encontrada", 404)
      vaga.empresa = empresa
    }
    vagaRepository.merge(vaga, body)
    const result = await vagaRepository.save(vaga)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const vaga = await vagaRepository.findOneBy({ id })
    if (!vaga) throw new AppError("Vaga não encontrada", 404)
    await vagaRepository.remove(vaga)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router