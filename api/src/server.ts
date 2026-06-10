import "reflect-metadata"
import "dotenv/config"
import cors from "cors"

import express, { NextFunction, Request, Response } from "express"
import { AppDataSource } from "./database/data-source"
import { ZodError } from "zod"
import AppError from "./utils/AppError"

import vaga from "./routes/vaga"
import empresa from "./routes/empresa"

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())


// Rotas
app.use("/api/vagas", vaga)
app.use("/api/empresas", empresa)

// Middleware de erro
const handleErrorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Erro de validação",
      issues: error.format(),
    })
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "erro",
      message: error.message,
    })
  }

  console.log(error)
  return res.status(500).json({
    status: "erro",
    message: "Erro interno do servidor",
  })
}

app.use(handleErrorMiddleware)

// Inicializa o banco e sobe o servidor
AppDataSource.initialize()
  .then(() => {
    console.log("Conectou no banco de dados")
    app.listen(Number(PORT), () => {
      console.log(`Servidor rodando na porta ${PORT}`)
    })
  })
  .catch((err) => {
    console.log("Erro ao conectar no banco de dados")
    console.log(err)
  })