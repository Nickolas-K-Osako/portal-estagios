import { Router } from "express"
import z from "zod"
import { AppDataSource } from "../database/data-source"
import { Empresa } from "../models/Empresa"
import AppError from "../utils/AppError"

const router = Router()
const empresaRepository = AppDataSource.getRepository(Empresa)

const empresaSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  cnpj: z.string().min(14, "CNPJ inválido"),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
  area_atuacao: z.string().optional(),
  status: z.string().optional(),
})

router.get("/", async (req, res, next) => {
  try {
    const empresas = await empresaRepository.find()
    res.json(empresas)
  } catch (error) {
    next(error)
  }

})

router.get("/:id", async (req, res, next) => {
  try{
    const id = Number(req.params.id)
    const empresa = await empresaRepository.findOneBy({ id })
    if (!empresa) throw new AppError("Empresa não encontrada", 404)
    res.json(empresa)
  } catch (error) {
    next(error);
  }
  
})
router.post("/", async (req, res, next) => {
  try {
    const body = empresaSchema.parse(req.body)
    const empresa = empresaRepository.create(body)
    const result = await empresaRepository.save(empresa)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const empresa = await empresaRepository.findOneBy({ id })
    if (!empresa) throw new AppError("Empresa não encontrada", 404)
    const body = empresaSchema.partial().parse(req.body)
    empresaRepository.merge(empresa, body)
    const result = await empresaRepository.save(empresa)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const empresa = await empresaRepository.findOneBy({ id })
    if (!empresa) throw new AppError("Empresa não encontrada", 404)
    await empresaRepository.remove(empresa)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router