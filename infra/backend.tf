terraform {
  backend "s3" {
    bucket = "tcl-terraform-bucket"
    key    = "soat8-g6/api/terraform.tfstate"
    region = "us-east-1"
  }
}

