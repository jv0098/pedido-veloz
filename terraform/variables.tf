
variable "aws_region" {
  type        = string
  description = "Região da AWS para deploy da infraestrutura"
  default     = "us-east-1"
}

variable "project_name" {
  type        = string
  description = "Nome do projeto para identificação de tags"
  default     = "loja-veloz"
}

variable "environment" {
  type        = string
  description = "Ambiente de implantação"
  default     = "production"
}

variable "vpc_cidr" {
  type        = string
  description = "Bloco CIDR da VPC principal"
  default     = "10.0.0.0/16"
}

variable "eks_cluster_version" {
  type        = string
  description = "Versão estável do Kubernetes no EKS"
  default     = "1.28"
}

variable "node_instance_type" {
  type        = string
  description = "Tipo de instância EC2 para os nós do Kubernetes (Custos vs Performance)"
  default     = "t3.medium" # Excelente custo-benefício para microsserviços leves
}

variable "node_desired_capacity" {
  type        = number
  description = "Capacidade de nós ativa recomendada inicial"
  default     = 3
}
