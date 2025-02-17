
resource "aws_elasticache_replication_group" "elasticache-valkey" {
  replication_group_id       = var.elasticache-cluster-id
  description                = "Elasticache Valkey Instance"
  engine                     = "valkey"
  engine_version             = "8.0"
  node_type                  = "cache.t4g.micro"
  parameter_group_name       = "default.valkey8"
  transit_encryption_enabled = false

  security_group_ids = [aws_security_group.elasticache_sg.id]

  tags = {
    microservice = "orders"
  }
}
