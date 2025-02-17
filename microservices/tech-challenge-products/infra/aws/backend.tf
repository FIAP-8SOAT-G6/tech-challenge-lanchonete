terraform {
  backend "s3" {
    bucket = "tcl-terraform-bucket-vitorrafael"
    key    = "soat8-g6/products/terraform.tfstate"
    region = "us-east-1"
  }
}
