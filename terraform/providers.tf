
terraform {
  required_version = ">= 1.3.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }

  # Configuração de Backend Remoto para manter o estado síncrono e seguro (Bloqueio de concorrência)
  # backend "s3" {
  #   bucket         = "loja-veloz-terraform-state"
  #   key            = "production/eks/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "loja-veloz-tflock"
  # }
}

provider "aws" {
  region = var.aws_region
}

# Provider Kubernetes dinâmico consumindo dados do EKS provisionado no main.tf
provider "kubernetes" {
  host                   = aws_eks_cluster.main.endpoint
  cluster_ca_certificate = base64decode(aws_eks_cluster.main.certificate_authority[0].data)
  token                  = data.aws_eks_cluster_auth.main.token
}
