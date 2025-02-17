# db-infrastructure

## Projeto da Infraestrutura do Banco de dados da Lanchonete

Projeto Lanchonete da Pós Gradução de Arquitetura de Software da FIAP.

<br>

Visão Geral
Este projeto utiliza Terraform para provisionar e gerenciar um banco de dados na AWS de forma automatizada, garantindo reprodutibilidade, escalabilidade e controle de versão da infraestrutura.

O Terraform cria e gerencia recursos como:

- Amazon RDS [(Relational Database Service)](https://aws.amazon.com/pt/rds/)
- Amazon S3 [(para armazenamento)](https://aws.amazon.com/pt/s3/)
- Amazon VPC [(para rede virtual isolada logicamente)](https://aws.amazon.com/pt/vpc/)

<hr/>

⚙️ Pré-requisitos

- Conta AWS
- Terraform
- S3

<hr/>
🚀 Executar o projeto

É necessário credencias da AWS para que seja realizado os comandos do terraform. Atualizar as credenciais localmente em `~/.aws/credentials`.

Executar para inicializar.

```
terraform init
```

Se houver mudanças no backend, pode ser necessário utilizar algumas flags para que as configurações possam ser aplicadas, como a flag `-reconfigure` usada por exemplo para o backend foi configurado incorretamente e precisa ser refeito, e o comando `-migrate-state` usado para migrar o estado do backendo do terraform.

Executar o comando para aplicar as mudanças

```
terraform apply -auto-approve
```

Ou o comando, para o caso seja necessário destruir a infraestrutura.

```
terraform destroy -auto-approve
```
