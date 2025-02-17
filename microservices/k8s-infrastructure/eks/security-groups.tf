resource "aws_security_group" "sg" {
  name        = "SG-${var.projectName}"
  description = "EKS Cluster Security Group"
  vpc_id      = data.aws_vpc.vpc.id

  ingress {
    description = "All"
    from_port   = 80
    to_port     = 80
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

  egress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow outbound traffic to RDS"
  }

  egress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow outbound traffic to Elasticache"
  }
}

resource "aws_security_group_rule" "eks_to_rds" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = data.terraform_remote_state.rds.outputs.rds_security_group_id
  source_security_group_id = aws_security_group.sg.id
}

resource "aws_security_group_rule" "eks_to_elasticache" {
  type                     = "ingress"
  from_port                = 6379
  to_port                  = 6379
  protocol                 = "tcp"
  security_group_id        = data.terraform_remote_state.elasticache.outputs.elasticache_security_group_id
  source_security_group_id = aws_security_group.sg.id
}
