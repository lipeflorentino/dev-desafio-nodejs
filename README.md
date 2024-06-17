# Projeto

## Requisitos

- Docker e Docker Compose instalados
- Node.js (para desenvolvimento e execução fora do contêiner) version: 22x

## Subindo os Serviços

Para iniciar todos os serviços (PostgreSQL, auth-service e url-shortener-service) usando Docker Compose, siga as etapas abaixo:

1. Clone o Repositório:

```sh
git clone https://github.com/seu-usuario/dev-desafio-nodejs.git
cd dev-desafio-nodejs
```

2. Iniciar os Serviços:

```sh
docker-compose up --build
```

3. Acesse a Documentação da API:

- auth-service: http://localhost:3001/api-docs
- url-shortener-service: http://localhost:3002/api-docs

## Acessar os Serviços

- Serviço de Autenticação: http://localhost:3001
- Serviço de Encurtamento de URLs: http://localhost:3002

## Database

```lua
Schema | Name | Type | Owner
--------+--------------------+-------+----------
public | Click | table | postgres
public | Url | table | postgres
public | User | table | postgres
public | \_prisma_migrations | table | postgres
```

### Melhorias

- Utilização de algum framework para desenvolvimento com node, por exemplo NestJS
- Ao inves de acessar as funções de acesso ao banco diretamente pelo controller, seria interessante criar uma interface
  de modo que seria mais simples trocar de ORM caso necessário
- Implementar o gateway para centralizar o acesso aos serviços
- Subir o projeto num cloudProvider, por exemplo AWS, uma forma de fazer seria usar o AWS RDS para base de dados postgresql, poderiamos usar o Elastic Beanstalk
  para hospedar as aplicações Node.js e o AWS ECS com Fargate para orquestração dos containeres. Api Gateway para expor os serviços.
- Ajustar o git workflow para funcionar corretamente (está apresentando problemas)
- Melhorar fluxo de CI/CD
- Implementar o husky (hooks)
- Contruir o banco de dados de uma maneira melhor, criar um schema para cada serviço com as tabelas separadas.
- Armazenar de forma diferente as informações sensíveis das variaveis de ambiente
- 
