# Etapa 1: build da aplicação .NET
# Usa imagem com SDK do .NET
# Compila e publica os arquivos para a pasta "out"
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build   
WORKDIR /app
COPY . .
RUN dotnet publish -c Release -o out             

# Etapa 2: imagem final mais enxuta
# Imagem de runtime do .NET (sem o SDK)
# Copia arquivos compilados da build
# Faz o app escutar em todas as interfaces na porta 5000
# Expõe a porta 5000
# Executa a aplicação .NET
FROM mcr.microsoft.com/dotnet/aspnet:9.0         
WORKDIR /app
COPY --from=build /app/out .                     
ENV ASPNETCORE_URLS=http://+:5000                
EXPOSE 5000                                      
ENTRYPOINT ["dotnet", "TodoList.API.Web.dll"]          