output "vpc_id" {
  description = "ID da VPC criada pelo Terraform"
  value       = aws_vpc.main.id
}

output "eks_cluster_endpoint" {
  description = "Endpoint da API do cluster Kubernetes gerenciado (EKS)"
  value       = aws_eks_cluster.main.endpoint
}

output "eks_cluster_name" {
  description = "Nome único do cluster EKS"
  value       = aws_eks_cluster.main.name
}

output "kubeconfig_connect_command" {
  description = "Comando CLI recomendado para conectar o terminal local ao cluster K8s criado"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${aws_eks_cluster.main.name}"
}
