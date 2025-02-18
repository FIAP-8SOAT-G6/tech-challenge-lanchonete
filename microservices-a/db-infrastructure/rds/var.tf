variable "projectName" {
  description = "Nome projeto"
  type        = string
  default     = "tech-challenge-lanchonete"
}

variable "databaseName" {
  description = "Nome do Banco de Dados"
  type        = string
  default     = "lanchoneteDatabase"
}

variable "regionDefault" {
  description = "Região da AWS"
  type        = string
  default     = "us-east-1"
}

variable "vpcCidr" {
  description = "CIDR da VPC"
  type        = string
  default     = "172.31.0.0/16"
}

variable "dbUsername" {
  description = "Usuário do banco de dados"
  type        = string
  default     = "postgres"
}

variable "dbSecret" {
  description = "Senha do banco de dados"
  type        = string
  default     = "MTIzNDU2"
}

variable "databases" {
  default = {
    "customer" = {
      identifier    = "customer-database"
      database_name = "customers"
      username      = "postgres"
      password      = "MTIzNDU2"
    }
    "products" = {
      identifier    = "products-database"
      database_name = "products"
      username      = "postgres"
      password      = "MTIzNDU2"
    }
    "orders" = {
      identifier    = "order-database"
      database_name = "orders"
      username      = "postgres"
      password      = "MTIzNDU2"
    }
  }
}
