import "reflect-metadata"
import "dotenv/config"
import { AppDataSource } from "../data-source"
import { Empresa } from "../../models/Empresa"
import { Aluno } from "../../models/Aluno"
import { Vaga } from "../../models/Vaga"
import { Candidatura } from "../../models/Candidatura"

async function rodarSeed() {
  await AppDataSource.initialize()

  const empresaRepo = AppDataSource.getRepository(Empresa)
  const alunoRepo = AppDataSource.getRepository(Aluno)
  const vagaRepo = AppDataSource.getRepository(Vaga)
  const candidaturaRepo = AppDataSource.getRepository(Candidatura)

  // Empresas
  const jaTemEmpresa = await empresaRepo.exists({ where: { cnpj: "12345678000190" } })
  if (!jaTemEmpresa) {
    const empresa1 = await empresaRepo.save(empresaRepo.create({
      nome: "Tech Solutions",
      cnpj: "12345678000190",
      email: "contato@techsolutions.com",
      telefone: "44999999999",
      area_atuacao: "Tecnologia",
      status: "aprovada",
    }))

    const empresa2 = await empresaRepo.save(empresaRepo.create({
      nome: "Marketing Pro",
      cnpj: "98765432000111",
      email: "contato@marketingpro.com",
      telefone: "44988887777",
      area_atuacao: "Marketing",
      status: "aprovada",
    }))

    // Vagas
    const vaga1 = await vagaRepo.save(vagaRepo.create({
      titulo: "Desenvolvedor Frontend",
      descricao: "Vaga para desenvolvedor frontend",
      area: "Tecnologia",
      requisitos: "HTML, CSS, JavaScript",
      carga_horaria: 20,
      modalidade: "remoto",
      status: "aberta",
      empresa: empresa1,
    }))

    const vaga2 = await vagaRepo.save(vagaRepo.create({
      titulo: "Analista de Marketing",
      descricao: "Vaga para analista de marketing digital",
      area: "Marketing",
      requisitos: "Redes sociais, Google Ads",
      carga_horaria: 30,
      modalidade: "presencial",
      status: "aberta",
      empresa: empresa2,
    }))

    // Alunos
    const jaTemAluno = await alunoRepo.exists({ where: { cpf: "12345678901" } })
    if (!jaTemAluno) {
      const aluno1 = await alunoRepo.save(alunoRepo.create({
        nome: "Lucas Silva",
        email: "lucas@email.com",
        cpf: "12345678901",
        matricula: "2024001",
        curso: "Sistemas para Internet",
        periodo: 3,
        apto: 1,
        status: "ativo",
      }))

      const aluno2 = await alunoRepo.save(alunoRepo.create({
        nome: "Ana Souza",
        email: "ana@email.com",
        cpf: "98765432100",
        matricula: "2024002",
        curso: "Sistemas para Internet",
        periodo: 2,
        apto: 1,
        status: "ativo",
      }))

      // Candidaturas
      await candidaturaRepo.save(candidaturaRepo.create({
        aluno: aluno1,
        vaga: vaga1,
        status: "pendente",
        data_candidatura: new Date(),
      }))

      await candidaturaRepo.save(candidaturaRepo.create({
        aluno: aluno2,
        vaga: vaga2,
        status: "aprovada",
        data_candidatura: new Date(),
      }))
    }
  }

  await AppDataSource.destroy()
}

rodarSeed().catch(async (err) => {
  console.error(err)
  if (AppDataSource.isInitialized) await AppDataSource.destroy()
  process.exit(1)
})