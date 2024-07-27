# Software Architecture Tech Challenge - Lanchonete

Projeto desenvolvido para a pós-graduação em Software Architecture da FIAP utilizando princípios de Arquitetura Hexagonal.

Desenvolvido por @ThawanFidelis, @gabrielescodino, @vitorrafael, @anadezuo e @RobsonArcoleze.

## Tecnologias & Bibliotecas
* NodeJS & JavaScript
  * `express` - https://www.npmjs.com/package/express
  * `sequelize` - https://www.npmjs.com/package/sequelize
* Postgres
* Docker
* Swagger
  * `swagger-jsdoc` - https://www.npmjs.com/package/swagger-jsdoc
  * `swagger-ui-express` - https://www.npmjs.com/package/swagger-ui-express

## Estrutura do Projeto
* `src` - Código fonte do projeto.
* `src/adapters` - `Adapters` do projeto para as tecnologias utilizadas. Por exemplo, `DatabaseAdapter` para operações com banco e `Controller` para processamento de requisições HTTP.
* `src/core` - Objetos do domínio da solução. Não devem depender de objetos que são criados fora dessa camada, devendo utilizar interfaces (`ports`) e injeção de dependência para execução da aplicação.
* `src/core/entities` - Entidades do domínio conforme identificado através dos exercícios de Domain-Driven Design.
* `src/core/use-cases` - Processos de negócio que foram identificados dentro do domínio; executados através da orquestração das entidades e das `ports`.
* `src/tests` - Testes do projeto.
* `app.js` - Ponto de entrada da aplicação, onde os objetos são instanciados com suas respectivas dependências e a aplicação começa a ser executada.

![Estrutura do Projeto](assets/ProjectStructure.png)