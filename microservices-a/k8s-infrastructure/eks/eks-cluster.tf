resource "aws_eks_cluster" "eks-cluster" {
  name     = var.projectName
  role_arn = data.aws_iam_role.labrole.arn

  vpc_config {
    subnet_ids         = [for subnet in data.aws_subnet.subnet : subnet.id if subnet.availability_zone != "${var.regionDefault}e"]
    security_group_ids = [aws_security_group.sg.id]
  }

  access_config {
    authentication_mode = var.accessConfig
  }
}

resource "aws_eks_node_group" "node-group" {
  cluster_name    = aws_eks_cluster.eks-cluster.name
  node_group_name = "NG-${var.projectName}"
  node_role_arn   = data.aws_iam_role.labrole.arn
  subnet_ids      = [for subnet in data.aws_subnet.subnet : subnet.id if subnet.availability_zone != "${var.regionDefault}e"]
  disk_size       = 50
  instance_types  = [var.instanceType]

  scaling_config {
    desired_size = 1
    max_size     = 2
    min_size     = 1
  }

  update_config {
    max_unavailable = 1
  }
}

resource "aws_eks_access_entry" "access-entry" {
  cluster_name      = aws_eks_cluster.eks-cluster.name
  principal_arn     = "arn:aws:iam::${var.accountId}:role/voclabs"
  kubernetes_groups = ["fiap"]
  type              = "STANDARD"
}

resource "aws_eks_access_policy_association" "eks-policy" {
  cluster_name  = aws_eks_cluster.eks-cluster.name
  policy_arn    = var.policyArn
  principal_arn = "arn:aws:iam::${var.accountId}:role/voclabs"

  access_scope {
    type = "cluster"
  }
}
