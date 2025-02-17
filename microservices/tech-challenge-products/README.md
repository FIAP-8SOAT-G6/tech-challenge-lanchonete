# Tech Challenge | Products Microservice

Esse microsserviço é reponsável pelo cadastro e busca de produtos.
A finalidade é a utilização dos registros na criação e gerenciamento dos pedidos no Tech Challenge Lanchonete.

## Tecnologias Utilizadas

- DevOps: SonarQube, GitHub Actions, Docker
- TypeScript & Node.JS
- PostgreSQL: Bando de dados relacional
- Swagger
  - `swagger-jsdoc` - https://www.npmjs.com/package/swagger-jsdoc

## Funcionalidades

- Listagem de produtos
- Listagem de produtos por categoria
- Exibição de produto por ID
- Cadastro de produto
- Atualização de produto
- Exclusão de produto

## Executando o Projeto

#### Pré-requisitos

- Ter a instalação do `docker` localmente.
- Ter alguma ferramenta para executar `kubernetes` localmente.

#### Executando o Docker

Para executar o projeto, deve ser realizado um dos seguintes comandos:

- `docker-compose up --build`
- `docker compose up --build`

\*_A flag `--build` é adicionada para garantir que a imagem esteja atualizada com as últimas modificações locais._

Para parar a execução do projeto, pode ser executado Ctrl+C e em seguida o comando

- `docker-compose down`

#### Acessando as APIs

Ao acessar a URL `http://localhost:8080/` (`docker compose`), você será redirecionado a documentação Swagger das APIs e poderá executar as requisições conforme documentado.

#### Executando os testes

Execute `npm run test` para rodar os testes unitários da aplicação.

## Estrutura do Projeto

- `src` - Código fonte do projeto.
- `src/api` - **Framework & Drivers** - Objetos que fazem a comunicação com o `express` para criar a API.
- `src/external` - **Frameworks & Drivers** - Objetos que fazem a comunicação com o sistemas externos. Por exemplo, objetos `DataSource`que interagem com o `sequelize` para accessar o banco de dados.
- `src/controllers` - **Interface Adapters** - Objetos que fazem a orquestração dos casos de uso para executar as regras de negócio.
- `src/gateways`- **Interface Adapters** - Objetos que intermediam a comunicação entre os casos de uso e os dados externos da aplicação, implementando as interfaces definidas pelos `use-cases`.
- `src/presenters` - **Interface Adapters** - Objetos que formatam os dados retornados pelos `use-cases` para serem retornados ao cliente.
- `src/interfaces` - **Interface Adapters** - Interfaces definidas pelos objetos pertencentes a esta camada para comunicação com objetos da camada **Framework & Drivers**
- `src/core` - Objetos do domínio da solução. Não devem depender de objetos que são criados fora dessa camada, devendo utilizar interfaces e injeção de dependência para execução da aplicação.
- `src/core/interfaces` - Interfaces definidas pelos objetos pertencentes a esta camada para comunicação com objetos externos (**Interface Adapters**);
- `src/core/<domain>/entities` - **Enteprise Business Rules** Entidades do domínio conforme identificado através dos exercícios de Domain-Driven Design.
- `src/core/<domain>/use-cases` - **Application Business Rules** Processos de negócio que foram identificados dentro do domínio; executados através da orquestração das entidades e das interfaces.
- `src/core/<domain>/exceptions` - Exceções lançadas pelos processos de negócio e entidades;
- `src/core/<domain>/dto` - Objetos para transferência de dados entre as camadas da aplicação;
- `src/factories` - Classes que auxiliam a instanciar os objetos das demais camadas.
- `src/tests` - Testes do projeto.
- `src/infrastructure` - Configurações de infraestrutura como banco de dados e documentação
- `src/routes` - Descrição das rotas do projeto para o Swagger.
- `app.js` - Ponto de entrada da aplicação, onde os objetos são instanciados com suas respectivas dependências e a aplicação começa a ser executada.

**OBS:** O arquivo `.env` foi compartilhado neste repositório para fins didáticos e facilidade nos testes, sendo esta uma má prática em ambientes de desenvolvimento real.

![Estrutura do Projeto](diagrams/project-structure.png)
