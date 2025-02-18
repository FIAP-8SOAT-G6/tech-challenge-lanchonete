resource "aws_s3_bucket" "backend" {
  bucket = "tcl-terraform-bucket-vitorrafael"
}

resource "aws_s3_bucket_ownership_controls" "backend" {
  bucket = aws_s3_bucket.backend.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "backend" {
  bucket = aws_s3_bucket.backend.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_acl" "backend" {
  depends_on = [
    aws_s3_bucket_ownership_controls.backend,
    aws_s3_bucket_public_access_block.backend,
  ]

  bucket = aws_s3_bucket.backend.id
  acl    = "public-read"
}

resource "aws_s3_bucket_policy" "backend" {
  bucket = aws_s3_bucket.backend.id

  policy = jsonencode({
    Version = "2012-10-17"
    ID      = "Policy"
    Statement = [
      {
        Sid    = "HTTPSOnly"
        Effect = "Deny"
        Principal = {
          "AWS" : "*"
        }
        Action = "s3:*"
        Resource = [
          aws_s3_bucket.backend.id,
          "${aws_s3_bucket.backend.arn}/*",
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      },
    ]
  })
}
