resource "aws_security_group" "db_sg" {
  name        = "SG-DB-instance-${var.projectName}"
  description = "Database Instance Security Group"
  vpc_id      = data.aws_vpc.vpc.id # TODO - configurar

  ingress {
    description = "All"
    from_port   = 5432
    to_port     = 5432
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