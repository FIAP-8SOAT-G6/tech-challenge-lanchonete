output "elasticache_security_group_id" {
  value       = aws_security_group.elasticache_sg.id
  description = "Elasticache Security Group ID"
}
