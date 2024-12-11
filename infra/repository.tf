resource "aws_ecr_repository" "lanchonete-api-ecr" {
  name                 = "lanchonete-api"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}
