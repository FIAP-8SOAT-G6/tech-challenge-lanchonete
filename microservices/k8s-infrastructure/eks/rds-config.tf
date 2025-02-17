data "terraform_remote_state" "rds" {
  backend = "s3"
  config = {
    bucket = "tcl-terraform-bucket-vitorrafael"
    key    = "soat8-g6/rds/terraform.tfstate"
    region = "us-east-1"
  }
}
