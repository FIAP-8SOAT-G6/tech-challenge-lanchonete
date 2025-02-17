# Tech Challenge Lanchonete | Kubernetes Infrastructure

Este repositório contém os artefatos necessários para configurar um cluster Kubernetes para o Tech Challenge da pós-graduação em Software Architecture da FIAP.

## Conteúdos

- [Estrutura](#estrutura)
- [Pré-Requisitos](#pre-requisitos)
- [Executando](#executando)

## Estrutura

- `eks` - Arquivos Terraforam para criação do AWS Elastic Kubernetes Service
- `microservice-chart` - Helm Chart para criação dos microserviços e aplicações que compõem o Tech Challenge Lanchonete
- `chart-values` - Valores utilizados para a criação dos microserviços
  - `local` - Valores utilizados para desenvolvimento local
  - `aws` - Valores utilizados para deploy na AWS

## Pré-Requisitos

- Cluster Kubernetes
- Helm

## Executando

O `microservice-chart` fornece os artefatos necessários para construir uma aplicação junto com um banco de dados.
Para utilizá-lo, é necessário executar o seguinte comando:

```bash
helm install <NOME DA RELEASE> microservice-chart -f chart-values/<ARQUIVO COM OS VALORES> 
```

### Monolito - Local
```bash
helm install lanchonete microservice-chart -f chart-values/local/values-lanchonete.yaml
```

### Orders - Local
```bash
helm install orders microservice-chart -f chart-values/local/values-orders.yaml
```

### Ingress
O manifesto `k8s/local-ingress` configura um recurso Kubernetes Ingress para execução no local com base no NGINX Ingress Controller.
1. Instale o NGINX Ingress Controller conforme o [Instalation Guide](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start).
2. Execute o comando `kubectl apply -f k8s/local-ingress.yaml` e o comando `kubectl get ingress`.
3. Adicione os host do `local-ingress` ao `/etc/hosts` da sua máquina, mapeando-os para o `ADDRESS` informado no `kubectl get ingress`.

