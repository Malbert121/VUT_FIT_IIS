FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

COPY Conventus.API/Conventus.API.csproj Conventus.API/
COPY Conventus.DAL/Conventus.DAL.csproj Conventus.DAL/
COPY Conventus.Models/Conventus.Models.csproj Conventus.Models/
COPY . .

RUN dotnet restore Conventus.API/Conventus.API.csproj
RUN dotnet publish Conventus.API/Conventus.API.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

COPY --from=build /app .
COPY Conventus.API/appsettings.json .

EXPOSE 8080

ENTRYPOINT ["dotnet", "Conventus.API.dll"]