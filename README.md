# Physical Store - Desafio 03
API desenvolvida utilizando NEST, com objetivo gerenciar lojas físicas de um eCommerce

## Instalação do Projeto
### Pré-requisitos
1. **Git**
    - É necessário que tenha o **git** na sua última versão
    - Verificar se o git está instalado:
    ```bash
    git --version
    ```
    - Caso não esteja instalado, é possível instalar através do [Downloads - Git](https://git-scm.com/downloads)
2. Node
    - Verificar se o node está instalado:
    ```bash
    node --version
    ```
    - Caso não esteja instalado, é possível instalar através do [Node.js - Run JavaScript Everywhere](https://nodejs.org/en)
4. MySQL
    - É necessário que tenha o **MySQL** na sua última versão
    - Verificar se o MySQL está instalado:
    ```bash
    mysql --version
    ```
    - Caso não esteja instalado, é possível instalar através do [MySQL Downloads](https://www.mysql.com/downloads/)
      
### Processo de instalação e execução do projeto
1. Clonar o repositório na sua máquina
    ```bash
    git clone git@github.com:Axiotes/api-physical-store.git
    ```
2. Entrar no diretório
    ```bash
    cd api-physical-store
    ```
3. Variáveis de ambiente  
    Renomeie o arquivo `env_example.txt` para `.env` e atribua valores ao respectivas variáveis, exemplo:
    ```
    DB_HOST="localhost"
    DB_PORT=3306
    DB_USERNAME="root"
    DB_PASSWORD="root"
    DATABASE="physical_store_db"
    ```
    Na aplicação são utilizadas APIs do Google Maps ([Geocoding](https://developers.google.com/maps/documentation/geocoding/overview?hl=pt-br) e [Directions](https://developers.google.com/maps/documentation/directions/overview?hl=pt-br)) e do [Melhor Envio](https://melhorenvio.com.br/painel), portanto é necessário obter uma API KEY para utilizá-las  

4. Criação de um banco de dados  
    No seu SGBD do MySQL crie o banco de dados
    ```sql
    CREATE DATABASE physical_store_db
    ```

5. Instalar dependências
    ```bash
    npm i
    ```

6. Executar aplicação  
    Existem dois scripts para execução da aplicação
    ```bash
    npm start # Executa API
    ```
    ```bash
    npm run dev # Executa API em desenvolvimento
    ```


## Scripts
### Migrations
1. Criar uma nova migration
     ```bash
     npm run migration:generate src/db/migrations/nome-migration
     ```
2. Executar migrations
     ```bash
     npm run migration:run
     ```
3. Reverter migrations
    ```bash
    npm run migration:revert
    ```

### Seed
1. Executar seeds
    ```bash
    npm run seed
    ```
2. Executar seeds de dados falsos
    ```bash
    npm run seed:fake-data
    ```

### Testes
1. Testes unitários
    ```bash
    npm test
    ```

## Documentação
Todos os endpoints foram documentados no **swagger**, no navegador acesse `http://localhost:3000/api/docs`. Para utiliza-lo é necessário está com a api em execução
