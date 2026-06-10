import { Router } from "express"
import { AppDataSource } from "../database/data-source"
import { Notificacao } from "../models/Notificacao"
import AppError from "../utils/AppError"

const router = Router()
const notificacaoRepository = AppDataSource.getRepository(Notificacao)

router.get("/:alunoId", async (req, res, next) => {
  try {
    const alunoId = Number(req.params.alunoId)
    const notificacoes = await notificacaoRepository.find({
      where: { aluno: { id: alunoId } },
      relations: { candidatura: true },
      order: { created_at: "DESC" }
    })
    res.json(notificacoes)
  } catch (error) {
    next(error)
  }
})

router.put("/:id/lida", async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const notificacao = await notificacaoRepository.findOneBy({ id })
    if (!notificacao) throw new AppError("Notificação não encontrada", 404)
    notificacao.lida = 1
    const result = await notificacaoRepository.save(notificacao)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

export default router