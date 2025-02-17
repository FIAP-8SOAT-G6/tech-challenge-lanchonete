variable "aws-region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-1"
}

variable "elasticache-cluster-id" {
  description = "ID do Elasticache"
  type        = string
  default     = "tcl-orders"
}

variable "vpcCidr" {
  description = "CIDR da VPC"
  type        = string
  default     = "172.31.0.0/16"
}
