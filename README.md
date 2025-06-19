
# Projeto .NET + Angular

Aplicação para simular autenticação e autorização com JWT e httpOnly.



## Rodando localmente

#### 1. Instale e inicialize o docker

#### 2. Clone o projeto

```bash
  git clone https://github.com/bcbrunofarias/todolist-auth-app
```

#### 3. Entre no diretório do projeto

```bash
  cd Todo.List
```

#### 4. Execute o docker compose
```bash
  docker-compose up
```

## Testes

#### Para efeitos de testes, segue a duração dos tokens:

| accessToken   | refresh-token       | 
| :---------- | :--------- |
| `1 min` | `2 min` |

#### API exposta no seguinte endereço:
```bash
  http://localhost:5000/api/todo
```

#### APP exposto no seguinte endereço:
```bash
  http://localhost:4200/home
```

## Usuários cadastrados

#### Usuários para teste na aplicação:

| username   | password       | roles      | permissions      |
| :---------- | :--------- | :------------- | :------------- |
| `admin@dotnet.com` | `admin` | `Admin` | `CanDelete` |
| `common@dotnet.com` | `common` | `Common` | - |
## Rotas de autenticação

#### 1. Registrar login e devolve um token JWT (accessToken)

```http
  POST /api/auth/login
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `username` | `string` | **Obrigatório**. Usuário do sistema |
| `password` | `string` | **Obrigatório**. Senha do usuário |

#### 2. Revoga os acessos do usuário

```http
  POST /api/auth/logout
```

#### 3. Renova o token do usuário e devolve um JWT (accessToken)

```http
  GET /api/auth/refresh-token
```

## Rotas de tarefas

#### 1. Criar uma nova tarefa

```http
  POST /api/todo
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `title` | `string` | **Obrigatório**. Título da tarefa |
| `description` | `string` | **Obrigatório**. Descrição	da tarefa |

#### 2. Atualizar tarefa selecionada por ID

```http
  PUT /api/todo/{id}
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `title` | `string` | **Obrigatório**. Título da tarefa |
| `description` | `string` | **Obrigatório**. Descrição	da tarefa |

#### 3. Listar todas tarefas registradas

```http
  GET /api/todo
```

#### 4. Devolve tarefa selecionada por ID

```http
  GET /api/todo/{id}
```

#### 5. Remove tarefa selecionada por ID (endpoint protegido)

```http
  DELETE /api/todo/{id}
```

| Header   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Authorization` | `Bearer` | **Obrigatório**. Token de autorização |


#### 6. Remove todas tarefas registradas (endpoint protegido)

```http
  DELETE /api/todo
```

| Header   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Authorization` | `Bearer` | **Obrigatório**. Token de autorização |
## Stack utilizada

**Front-end:** Angular v20

**Back-end:** .NET v9, EntityFramework, JwtBearer, PostgreSQL

