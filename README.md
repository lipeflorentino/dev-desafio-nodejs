# Estrutura do Projeto

```lua
my-project/
|-- auth-service/
|   |-- Dockerfile
|   |-- prisma/
|   |-- src/
|   |   |-- authController.js
|   |   |-- swagger.js
|   |-- openapi.yaml
|-- url-shortener-service/
|   |-- Dockerfile
|   |-- prisma/
|   |-- src/
|   |   |-- urlController.js
|   |   |-- swagger.js
|   |-- openapi.yaml
|-- docker-compose.yml
```

## Requisitos

- Docker e Docker Compose instalados
- Node.js (para desenvolvimento e execução fora do contêiner)

## Subindo os Serviços

Para iniciar todos os serviços (PostgreSQL, auth-service e url-shortener-service) usando Docker Compose, siga as etapas abaixo:

1. Clone o Repositório:

```sh
git clone https://github.com/seu-usuario/my-project.git
cd my-project
```

2. Iniciar os Serviços:

```sh
docker-compose up --build
```

3. Acesse a Documentação da API:

- auth-service: http://localhost:3000/api-docs
- url-shortener-service: http://localhost:3001/api-docs

## Acessar os Serviços

- Serviço de Autenticação: http://localhost:3001
- Serviço de Encurtamento de URLs: http://localhost:3002

## Database

Schema | Name | Type | Owner
--------+--------------------+-------+----------
public | Click | table | postgres
public | Url | table | postgres
public | User | table | postgres
public | \_prisma_migrations | table | postgres
