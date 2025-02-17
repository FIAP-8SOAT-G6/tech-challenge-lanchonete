resource "aws_db_instance" "rds" {
  for_each               = var.databases
  allocated_storage      = 20
  engine                 = "postgres"
  engine_version         = "14.15"
  identifier             = each.value.identifier # Nome do banco de dados
  db_name                = each.value.database_name
  instance_class         = "db.t3.medium"
  username               = each.value.username #var.dbUsername
  password               = each.value.password #var.dbSecret
  parameter_group_name   = "default.postgres14"
  publicly_accessible    = false
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  storage_encrypted      = true

  skip_final_snapshot = true

  # Configuração de backup
  maintenance_window      = "Tue:00:00-Tue:03:00"
  backup_window           = "03:00-06:00"
  backup_retention_period = 30

  tags = {
    Name = "Banco ${each.key}"
    Env  = "Production"
  }
}
