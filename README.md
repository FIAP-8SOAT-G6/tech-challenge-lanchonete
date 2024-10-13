# Software Architecture Tech Challenge - Lanchonete

Projeto desenvolvido para a pós-graduação em Software Architecture da FIAP utilizando princípios de Arquitetura Limpa.

Desenvolvido por @ThawanFidelis, @gabrielescodino, @vitorrafael e @anadezuo.

#### Tabela de Conteúdos

1. [Requisitos](#requisitos)
2. [Arquitetura](#arquitetura)
   1. [Arquitetura da Aplicação](#arquitetura-da-aplicação)
   2. [Arquitetura do Kubernetes](#arquitetura-do-kubernetes)
   3. [Arquitetura AWS - Concepção](#arquitetura-aws---concepção)
3. [Rodando o Projeto](#rodando-o-projeto)
   1. [Pré-Requsiitos](#pré-requisitos)
   2. [Executando o Docker](#executando-o-docker)
   3. [Executando o Kubernetes](#executando-o-kubernetes)
   4. [Acessando as APIs](#acessando-as-apis)
   5. [Executando os Testes](#executando-os-testes)
4. [Tarefas](#tarefas)
5. [Tecnologias & Bibliotecas](#tecnologias--bibliotecas)
6. [Estrutura do Projeto](#estrutura-do-projeto)

## Requisitos

### Requisitos Funcionais

| Identificador | Descrição                                                                                                                                                  |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RF-1          | Aplicação deve fornecer API para cadastrar o cliente.                                                                                                      |
| RF-2          | Aplicação deve fornecer API para identificar o cliente por CPF.                                                                                            |
| RF-3          | Aplicação deve fornecer API para criar, editar e remover produtos.                                                                                         |
| RF-4          | Aplicação deve fornecer API para buscar produtos por categoria.                                                                                            |
| RF-5          | Aplicação deve fornecer API para realizar o checkout do pedido; durante a Fase 1, deverá ser implementado um _fake checkout_.                              |
| RF-6          | Aplicação deve fornecer API para listar os pedidos.                                                                                                        |
| RF-7          | Aplicação deve fornecer API para consultar o status de pagamento do pedido, se foi aprovado ou recusado.                                                   |
| RF-8          | Aplicação deve fornecer um _webhook_ para receber confirmação do pagamento aprovado ou recusado.                                                           |
| RF-9          | Aplicação deverá ordernar os pedidos pelo status 'Pronto' > 'Em Preparação' > 'Recebido' e data de criação. Pedidos 'Finalizado' não devem ser retornados. |
| RF-10         | Aplicação deverá fornecer API para atualizar o status do pedido.                                                                                           |
| RF-11         | \[**Opcional**\] Aplicação deverá integrar com Mercado Pago.                                                                                               |

### Requisitos Não-Funcionais

| Identificador | Descrição                                                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| RNF-1         | Aplicação deverá ser desenvolvida seguindo os princípios de Arquitetura Limpa                                                       |
| RNF-2         | Aplicação deverá fornecer a documentação das APIs por Swagger ou Postman Collection                                                 |
| RNF-3         | Infraestrutura - Aplicação deverá ser desenvolvida utilizando Kubernetes para aumentar a sua resiliência.                           |
| RNF-4         | Infraestrutura - Aplicação deverá suportar o aumento de demanda, subindo novas instâncias conforme o número de requisições aumenta. |

## Arquitetura

### Arquitetura da Aplicação

A aplicação foi desenvolvida seguindo os princípios da Arquitetura Limpa (Clean Architecture) proposta por Robert C. Martin. O objetivo é garantir que as regras de negócio fiquem isoladas e independentes de detalhes externos, como frameworks ou banco de dados, facilitando a manutenção, escalabilidade e testabilidade da aplicação.

* **Enterprise Business Rules**: Camada que contém as entidades (_Entities_) do domínio, que representam os conceitos centrais e regras mais importantes da aplicação que garantem a consistência das regras de negócio. São independentes de infraestrutura ou do caso de uso em que são utilizadas.
* **Aplication Business Rules**: Camada que contém os casos de uso (_Use Case_) que definem como as entidades interagem entre si para cumprir os requisitos funcionais da aplicação. São independentes dos detalhes de infraestrutura e dependem apenas de interfaces para interagir com objetos externos.
* **Interface Adapters**: Camada que adapta a entrada e saída de dados entre o sistema e os consumidores externos, responsável pela lógica que conecta os casos de uso ao mundo exterior. Seus principais componentes são:
  * **Gateways:** Implementações das interfaces dos casos de uso para acessar sistemas externos (exemplo: banco de dados, sistemas de pagamento);
  * **Presenters:** Adaptam o resultado dos casos de uso para as camadas externas conforme o formato esperado;
  * **Controllers:** Recebem as requisições externas e executam os casos de uso com suas respectivas dependências.
* **Frameworks & Drivers**: Camada com  _frameworks_ e serviços externos usados pela aplicação como bibliotecas de _Web API_, objetos que encapsulam comunicação com banco de dados, sistemas externos, etc. Serve apenas para viabilizar a interação com o mundo exterior, sem lógica de negócios.

No diagrama a seguir, é possível identificar que cada camada se comunica de forma unidirecional, com as camadas externas dependendo das internas. Isso garante que as regras de negócio permaneçam independentes de detalhes técnicos. Para tanto, é necessário seguir os princípios SOLID como o _Single Responsibility Principle_, uma vez que cada objeto e camada tem uma única responsabilidade, e o _Dependency Inversion Principle_, visto que as camadas internas dependem de abstrações e as implementações são fornecidas pelas camadas externas.
![Arquitetura da Aplicação](diagrams/application-architecture.png)

### Arquitetura do Kubernetes

A arquitetura K8s foi desenvolvida para permitir a escalabilidade do sistema conforme a demanda. O diagrama a seguir representa essa estrutura:
![Arquitetura K8s](diagrams/k8s-architecture.png)

A aplicação opera dentro de um cluster Kubernetes, onde os _nodes_ seguem a seguinte estrutura:
* **Deployment lanchonete-api:** Responsável por gerenciar os pods que executam a aplicação desenvolvida. Possui um **Horizontal Pod Autoscaler (HPA)** associado para monitorar a utilização de CPU e escalar horizontalmente os pods, a fim de suportar a demanda por recursos. É exposto ao exterior através de um **Service NodePort** para que clientes consigam consumir as APIs desenvolvidas.
* **StatefulSet lanchonete-db:** Responsável por gerenciar o banco de dados da aplicação. Está vinculado a um **Persistent Volume Claim (PVC)** para garantir o armazenamento persistente dos dados, utilizando um Persistent Volume. O banco de dados é acessível apenas dentro do cluster K8s por meio de um **ClusterIP Service**, de forma que os pods da aplicação possam se conectar ao banco de dados de maneira segura.
* **ConfigMaps lanchonete-api-config e lanchonete-db-config**: Utilizados para armazenar os valores de configuração da API e do banco de dados, como parâmetros não sensíveis e informações de ambiente.
* **Secret lanchonete-db-secret:** Utilizado para armazenar valores sensíveis, como a senha de acesso ao banco de dados.

#### Fluxo de Comunicação
1. O NodePort Service expõe a API externamente, encaminhando as requisições para os diferentes pods gerenciados pelo Deployment `lanchonete-api`.
2. Os pods `lanchonete-api` se comunicam com o `lanchonete-db` por meio de um ClusterIP Service, que encaminha as requisições para os pods do banco de dados, gerenciados pelo StatefulSet. Assim, o `lanchonete-api` pode realizar as operações necessárias no banco de dados.
  > Os ConfigMaps e o Secret são utilizados durante a inicialização dos pods para configurar a conexão com o banco de dados e outros serviços externos

### Arquitetura AWS - Concepção

> **Importante:** A arquitetura descrita a seguir é apenas uma concepção da equipe de desenvolvimento sobre a aplicação em ambiente AWS. Não foi implementada e testada, estando passível de correções e mudanças para suportar os requerimentos com mais desempenho, segurança e observabilidade.

![Arquitetura AWS](diagrams/aws-eks-architecture-diagram.png)

A arquitetura proposta utiliza serviços gerenciados da AWS para oferecer uma solução escalável e resiliente. Seguem os principais componentes:
* **Amazon Route 53**: Os usuários finais interagem com a API por meio do **Amazon Route 53**, que atua como um serviço de DNS gerenciado para rotear o tráfego.

* **Network Load Balancer (NLB)**: Encaminha as requisições dentro da **Virtual Private Cloud (VPC)** para o **Amazon Elastic Kubernetes Service (EKS)**. 

* **Kubernetes Ingress**: Gerencia o roteamento das requisições para os serviços corretos da aplicação.

* **Amazon EKS (Elastic Kubernetes Service)**: A aplicação é implantada em um **Amazon EKS Cluster** dentro de uma **sub-rede privada**. Os detalhes sobre o Cluster K8S podem ser encontrados em [Arquitetura do Kubernetes](#arquitetura-do-kubernetes)

* **Amazon ECR (Elastic Container Registry)**: Armazenamento das imagens dos containers da aplicação, facilitando a atualização dos pods dentro do cluster EKS que utilizam a tag _latest_.

## Rodando o Projeto

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

#### Executando o Kubernetes

Para executar o projeto utilizando Kubernetes, execute o seguinte comando:

- `kubectl apply -f k8s/ -R`
  > Pode ser necessário utilizar outro comando dependendo da ferramente de Kubernetes que estiveres utilizando.

Isso criará os artefatos necessários accessar o projeto de um Cluster K8s.

#### Acessando as APIs

Ao acessar a URL `http://localhost:8080/` (`docker compose`) ou `http://localhost:31200` (`kubernetes`), você será redirecionado a documentação Swagger das APIs e poderá executar as requisições conforme documentado.

> Caso você esteja executando em Cluster Kubernetes, pode ser necessário habilitar criar um _tunnel_ entre a sua máquina e o Cluster Kubernetes. Por exemplo:  
> Minikube - `minikube service lanchonete-api-servce --url`  
> Docker Desktop - `kubectl port-forward services/lanchonete-api-service 8080:80`  
> Isso é necessário apenas se não conseguir acessar o Cluster de seu `localhost`.

#### Executando os testes

Execute `npm run test` para rodar os testes unitários da aplicação

Execute teste de carga `k6` com `npm run test:k8s`
> Obs.: Instale o `k6` em sua máquina conforme: https://grafana.com/docs/k6/latest/set-up/install-k6/

## Tarefas

As tarefas estão descritas em projetos da organização do GitHub.

- [Fase 1](https://github.com/orgs/FIAP-8SOAT-G6/projects/1)
- [Fase 2](https://github.com/orgs/FIAP-8SOAT-G6/projects/2)

## Tecnologias & Bibliotecas

- NodeJS (^v22) & TypeScript
  - `express` - https://www.npmjs.com/package/express
  - `sequelize` - https://www.npmjs.com/package/sequelize
- Postgres
- Docker
- Swagger
  - `swagger-jsdoc` - https://www.npmjs.com/package/swagger-jsdoc
  - `swagger-ui-express` - https://www.npmjs.com/package/swagger-ui-express

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

![Estrutura do Projeto](diagrams/project-structure.png.png)
