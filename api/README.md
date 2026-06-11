
# Portal de Estágios — API Node.js

API RESTful desenvolvida em Node.js com TypeScript, responsável por centralizar a lógica de negócio do Portal de Estágios UniALFA.

## Tecnologias

- Node.js + TypeScript
- Express
- TypeORM
- MySQL
- Zod

## Instalação

```bash
npm install
```

Configure o arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=db_estagio
PORT=3000
```

Crie o banco de dados `db_estagio` no MySQL, depois rode as migrations:

```bash
npx typeorm-ts-node-commonjs migration:run -d src/database/data-source.ts
```
Popule o banco com dados iniciais:

```bash
npm run seed
```

Inicie o servidor:

```bash
npm run dev
```

## Endpoints

### Empresas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/empresas | Lista todas as empresas |
| GET | /api/empresas/:id | Busca empresa por id |
| POST | /api/empresas | Cria empresa |
| PUT | /api/empresas/:id | Atualiza empresa |
| DELETE | /api/empresas/:id | Remove empresa |

### Vagas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/vagas | Lista todas as vagas |
| GET | /api/vagas/:id | Busca vaga por id |
| POST | /api/vagas | Cria vaga |
| PUT | /api/vagas/:id | Atualiza vaga |
| DELETE | /api/vagas/:id | Remove vaga |

### Alunos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/alunos | Lista todos os alunos |
| GET | /api/alunos/:id | Busca aluno por id |
| POST | /api/alunos | Cria aluno |
| PUT | /api/alunos/:id | Atualiza aluno |
| DELETE | /api/alunos/:id | Remove aluno |

### Candidaturas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/candidaturas | Lista todas as candidaturas |
| GET | /api/candidaturas/:id | Busca candidatura por id |
| POST | /api/candidaturas | Cria candidatura |
| PUT | /api/candidaturas/:id/status | Atualiza status da candidatura |
| DELETE | /api/candidaturas/:id | Remove candidatura |

### Notificações
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/notificacoes/:alunoId | Lista notificações do aluno |
| PUT | /api/notificacoes/:id/lida | Marca notificação como lida |

## Funcionamento

Ao atualizar o status de uma candidatura para `aprovada` ou `rejeitada`, o sistema cria automaticamente uma notificação para o aluno.

## Estrutura

```
src/
├── database/
│   ├── data-source.ts
│   ├── migrations/
│   └── seeds/
├── models/
├── routes/
└── utils/
```
