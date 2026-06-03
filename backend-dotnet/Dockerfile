# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY src/PolyglotApi/*.csproj ./src/PolyglotApi/
RUN dotnet restore ./src/PolyglotApi/PolyglotApi.csproj

COPY src/ ./src/
RUN dotnet publish ./src/PolyglotApi/PolyglotApi.csproj -c Release -o /out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out .

ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 5000
ENTRYPOINT ["dotnet", "PolyglotApi.dll"]
