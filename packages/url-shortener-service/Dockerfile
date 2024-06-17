# Utiliza a imagem do Node.js 22 com base no Alpine
FROM node:22-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todo o código para o contêiner
COPY . .

# Instala o Prisma Client
RUN npx prisma generate

# Expõe a porta da aplicação
EXPOSE 3001

# Define o comando para iniciar o serviço
CMD ["npm", "start"]
