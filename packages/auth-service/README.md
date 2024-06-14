# `auth-service`

> TODO: description

## Usage

```
const authService = require('auth-service');

// TODO: DEMONSTRATE API
```

## Comandos Prisma

### Migrar o Banco de Dados

Gere e aplique as migrações para criar as tabelas no banco de dados:

```
npx prisma migrate dev --name init
```

### Gerar o Cliente Prisma

Gere o cliente Prisma para interagir com o banco de dados:

```
npx prisma generate
```

### Database

Schema | Name | Type | Owner
--------+--------------------+-------+----------
public | Click | table | postgres
public | Url | table | postgres
public | User | table | postgres
public | \_prisma_migrations | table | postgres
