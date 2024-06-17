# URL Shortener Service

> Este serviço lida com encurtamento de URL e redirecionamento

## Requisitos

- Node.js version: 22.x
- Docker (opcional, para uso de contêineres)

## Configuração Local

1. Instalar Dependências:

```sh
cd url-shortener-service
npm install
```

2. Configurar Variáveis de Ambiente:

Crie um arquivo `.env` e adicione:

```env
DATABASE_URL=postgres://userdb:postgres2024@localhost:5432/postgresdb
```

3. Executar Migrações:

```sh
npx prisma migrate dev
```

4. Iniciar o Serviço:

```sh
npm start
```

5. Acesse a Documentação da API:

- Swagger UI: `http://localhost:3001/api-docs`

## Docker

1. Construir e Subir o Contêiner

```sh
docker build -t url-shortener-service .
docker run -p 3001:3001 --env-file .env url-shortener-service
```
