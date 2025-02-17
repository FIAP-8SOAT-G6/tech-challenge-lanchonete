# output "rds_endpoint" {
#   value       = aws_db_instance.rds.address
#   description = "RDS Instance Endpoint"
# }

# output "rds_port" {
#   value = aws_db_instance.rds.port
# }

output "rds_ports" {
  value = { for k, v in aws_db_instance.rds : k => v.port }
}

output "rds_endpoints" {
  value = { for k, v in aws_db_instance.rds : k => v.endpoint }
}

output "rds_security_group_id" {
  value       = aws_security_group.db_sg.id
  description = "RDS Instance Security Group ID"
}