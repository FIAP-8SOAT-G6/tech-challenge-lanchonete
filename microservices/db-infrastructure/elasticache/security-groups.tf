resource "aws_security_group" "elasticache_sg" {
  name        = "SG-Elasticache-${var.elasticache-cluster-id}"
  description = "Database Instance Security Group"
  vpc_id      = data.aws_vpc.vpc.id

  ingress {
    description = "All"
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "All"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
