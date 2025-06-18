# Etapa 1: build da aplicação Angular
# Usa imagem Node.js para compilar o Angular
# Define o diretório de trabalho como /app
# Copia todos os arquivos da pasta frontend para dentro da imagem
# Instala as dependências do projeto Angular
# Compila o Angular em modo produção

FROM node:20 AS build         
WORKDIR /app                  
COPY . .                      
RUN npm install               
RUN npm run build --prod      

# Etapa 2: imagem final com NGINX
# Usa imagem do NGINX leve para servir arquivos estáticos
# Copia os arquivos estáticos gerados na build para o diretório padrão do NGINX
# Substitui a configuração padrão do NGINX por uma customizada
# Expõe a porta 80 para acessar o app

FROM nginx:stable-alpine                                                
COPY --from=build /app/dist/TodoList.APP/browser/ /usr/share/nginx/html  
COPY nginx.conf /etc/nginx/conf.d/default.conf                          
EXPOSE 80                                                               

