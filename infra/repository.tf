resource "aws_ecr_repository" "lanchonete_api_ecr" {
  name                 = var.repositoryName
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

output "ecr_repository" {
  value = var.repositoryName
}
