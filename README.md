# Software Architecture Tech Challenge - Lanchonete

Projeto desenvolvido para a pós-graduação em Software Architecture da FIAP utilizando princípios de Arquitetura Hexagonal.

Desenvolvido por @ThawanFidelis, @gabrielescodino, @vitorrafael, @anadezuo e @RobsonArcoleze.

## Rodando o Projeto

#### Pré-requisitos

- Ter a instalação do `docker` localmente.

Para executar o projeto, deve ser realizado o seguinte comando:

- `docker-compose up --build`

\*_A flag `--build` é adicionada para garantir que a imagem esteja atualizada com as últimas modificações locais._

Para parar a execução do projeto, pode ser executado Ctrl+C e em seguida o comando

- `docker-compose down`

## Tarefas

As tarefas estão descritas em projetos da organização do GitHub.

- [Fase 1](https://github.com/orgs/FIAP-8SOAT-G6/projects/1)

## Tecnologias & Bibliotecas

- NodeJS (^v22) & JavaScript
  - `express` - https://www.npmjs.com/package/express
  - `sequelize` - https://www.npmjs.com/package/sequelize
- Postgres
- Docker
- Swagger
  - `swagger-jsdoc` - https://www.npmjs.com/package/swagger-jsdoc
  - `swagger-ui-express` - https://www.npmjs.com/package/swagger-ui-express

## Estrutura do Projeto

- `src` - Código fonte do projeto.
- `src/adapters` - `Adapters` do projeto para as tecnologias utilizadas. Por exemplo, `DatabaseAdapter` para operações com banco e `Controller` para processamento de requisições HTTP.
- `src/core` - Objetos do domínio da solução. Não devem depender de objetos que são criados fora dessa camada, devendo utilizar interfaces (`ports`) e injeção de dependência para execução da aplicação.
- `src/core/<domain>/entities` - Entidades do domínio conforme identificado através dos exercícios de Domain-Driven Design.
- `src/core/<domain>/use-cases` - Processos de negócio que foram identificados dentro do domínio; executados através da orquestração das entidades e das `ports`.
- `src/tests` - Testes do projeto.
- `app.js` - Ponto de entrada da aplicação, onde os objetos são instanciados com suas respectivas dependências e a aplicação começa a ser executada.

![Estrutura do Projeto](assets/ProjectStructure.png)
