# Usar a imagem base node:22-alpine
FROM node:22-alpine

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o arquivo package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código da aplicação para o contêiner
COPY . .

# Expor a porta que a aplicação usará
EXPOSE 3001

# Definir a variável de ambiente para o modo de produção
ENV NODE_ENV=production

# Comando para rodar a aplicação
CMD ["node", "app.js"]